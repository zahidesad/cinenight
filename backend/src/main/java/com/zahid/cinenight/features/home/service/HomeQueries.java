package com.zahid.cinenight.features.home.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional(readOnly = true)
public class HomeQueries {

    @PersistenceContext
    private EntityManager em;

    public record TopMovie(Long movieId, String title, Long votes) {}

    public List<TopMovie> topMovies(int limit) {
        var rows = em.createQuery("""
                select m.id, m.title, coalesce(sum(v.weight), 0)
                from PollOption po
                  join po.movie m
                  left join Vote v on v.option = po
                group by m.id, m.title
                order by coalesce(sum(v.weight), 0) desc
                """, Object[].class)
                .setMaxResults(limit)
                .getResultList();

        return rows.stream()
                .map(r -> new TopMovie(((Number) r[0]).longValue(), (String) r[1], ((Number) r[2]).longValue()))
                .toList();
    }
}
