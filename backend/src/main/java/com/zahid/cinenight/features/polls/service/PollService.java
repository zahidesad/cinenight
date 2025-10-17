package com.zahid.cinenight.features.polls.service;

import com.zahid.cinenight.features.groups.domain.Group;
import com.zahid.cinenight.features.groups.domain.GroupMember;
import com.zahid.cinenight.features.groups.domain.GroupMemberId;
import com.zahid.cinenight.features.groups.domain.GroupMemberRepository;
import com.zahid.cinenight.features.groups.domain.GroupRepository;
import com.zahid.cinenight.features.movies.domain.Movie;
import com.zahid.cinenight.features.movies.domain.MovieRepository;
import com.zahid.cinenight.features.movies.service.MovieService;
import com.zahid.cinenight.features.polls.domain.*;
import com.zahid.cinenight.features.users.domain.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PollService {

    public record CreatePollReq(@NotNull Long groupId, @NotBlank String title, String description,
                                LocalDateTime closesAt, Boolean allowAddOptions, Integer maxVotesPerUser) {}
    public record PollDto(Long id, Long groupId, String title, boolean isOpen, String publicToken) {
        public static PollDto of(Poll p) {
            return new PollDto(p.getId(), p.getGroup().getId(), p.getTitle(), Boolean.TRUE.equals(p.getIsOpen()), p.getPublicToken());
        }
    }
    public record AddOptionReq(@NotNull Long pollId, @NotNull Integer tmdbId, String label, String language) {}
    public record VoteReq(@NotNull Long optionId) {}
    public record OptionResult(Long optionId, Integer tmdbId, String title, long votes) {}

    private final GroupRepository groups;
    private final GroupMemberRepository members;
    private final PollRepository polls;
    private final PollOptionRepository options;
    private final VoteRepository votes;
    private final MovieRepository movies;
    private final MovieService movieService;
    private final UserRepository users;

    public PollService(GroupRepository groups, GroupMemberRepository members,
                       PollRepository polls, PollOptionRepository options,
                       VoteRepository votes, MovieRepository movies, MovieService movieService,
                       UserRepository users) {
        this.groups = groups;
        this.members = members;
        this.polls = polls;
        this.options = options;
        this.votes = votes;
        this.movies = movies;
        this.movieService = movieService;
        this.users = users;
    }

    private void ensureMember(Long groupId, Long userId) {
        var key = new GroupMemberId(groupId, userId);
        GroupMember m = members.findById(key).orElseThrow(() -> new IllegalArgumentException("Bu gruba üye değilsiniz."));
        if (m == null) throw new IllegalArgumentException("Bu gruba üye değilsiniz.");
    }

    @Transactional
    public PollDto create(CreatePollReq req, Long userId) {
        Group g = groups.findById(req.groupId()).orElseThrow(() -> new IllegalArgumentException("Grup bulunamadı."));
        ensureMember(g.getId(), userId);

        Poll p = new Poll();
        p.setGroup(g);
        p.setTitle(req.title());
        p.setDescription(req.description());
        p.setClosesAt(req.closesAt());
        p.setIsOpen(true);
        p.setAllowAddOptions(req.allowAddOptions() == null ? Boolean.TRUE : req.allowAddOptions());
        p.setMaxVotesPerUser(req.maxVotesPerUser() == null ? 1 : Math.max(1, req.maxVotesPerUser()));
        p.setPublicToken(Long.toHexString(System.nanoTime())); // basit token
        polls.save(p);

        return PollDto.of(p);
    }

    @Transactional
    public void addOption(AddOptionReq req, Long userId) {
        Poll p = polls.findById(req.pollId()).orElseThrow(() -> new IllegalArgumentException("Anket bulunamadı."));
        ensureMember(p.getGroup().getId(), userId);
        if (!Boolean.TRUE.equals(p.getIsOpen())) throw new IllegalArgumentException("Anket kapalı.");

        String lang = (req.language() == null || req.language().isBlank()) ? "tr-TR" : req.language();
        movieService.byId(req.tmdbId(), lang);
        Movie m = movies.findByTmdbId(req.tmdbId()).orElseThrow();

        PollOption po = new PollOption();
        po.setPoll(p);
        po.setMovie(m);
        po.setLabel(req.label());
        po.setAddedBy(users.findById(userId).orElse(null));
        options.save(po);
    }

    @Transactional
    public void vote(Long pollId, VoteReq req, Long userId) {
        Poll p = polls.findById(pollId).orElseThrow(() -> new IllegalArgumentException("Anket bulunamadı."));
        ensureMember(p.getGroup().getId(), userId);
        if (!Boolean.TRUE.equals(p.getIsOpen())) throw new IllegalArgumentException("Anket kapalı.");

        PollOption opt = options.findById(req.optionId()).orElseThrow(() -> new IllegalArgumentException("Seçenek bulunamadı."));
        if (!opt.getPoll().getId().equals(pollId)) throw new IllegalArgumentException("Seçenek bu ankete ait değil.");

        var existing = votes.findByPollIdAndUserId(pollId, userId);
        if (existing.isPresent()) {
            // single-choice: var olan oyu yeni seçeneğe taşı
            var v = existing.get();
            v.setOption(opt);
            votes.save(v);
        } else {
            Vote v = new Vote();
            v.setPoll(p);
            v.setOption(opt);
            v.setUser(users.findById(userId).orElseThrow());
            v.setWeight(1);
            votes.save(v);
        }
    }

    public List<OptionResult> results(Long pollId) {
        Poll p = polls.findById(pollId).orElseThrow(() -> new IllegalArgumentException("Anket bulunamadı."));
        return options.findAll().stream()
                .filter(o -> o.getPoll().getId().equals(p.getId()))
                .map(o -> new OptionResult(
                        o.getId(),
                        o.getMovie().getTmdbId(),
                        o.getMovie().getTitle(),
                        votes.countByOptionId(o.getId())))
                .sorted((a,b) -> Long.compare(b.votes(), a.votes()))
                .toList();
    }

    public PollDto getByPublicToken(String token) {
        Poll p = polls.findByPublicToken(token).orElseThrow(() -> new IllegalArgumentException("Geçersiz token."));
        return PollDto.of(p);
    }

    @Transactional
    public void close(Long pollId, Long userId) {
        Poll p = polls.findById(pollId).orElseThrow(() -> new IllegalArgumentException("Anket bulunamadı."));
        ensureMember(p.getGroup().getId(), userId);
        p.setIsOpen(false);
        polls.save(p);
    }
}
