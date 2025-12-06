import { apiGet, apiPost } from './client';

export type PollOptionDto = {
    id: number;
    tmdbId: number;
    title: string;
    posterPath: string | null;
    releaseYear: number | null;
    addedBy: string;
    voteCount: number;
    isVotedByMe: boolean;
};

export type PollDetailDto = {
    id: number;
    title: string;
    description?: string;
    isOpen: boolean;
    publicToken: string;
    options: PollOptionDto[];
};

export function suggestMovie(groupId: number, tmdbId: number, title: string) {
    return apiPost<string>('/polls/suggest', { groupId, tmdbId, title });
}

export function fetchActivePoll(groupId: number) {
    return apiGet<PollDetailDto>(`/polls/group/${groupId}/active`);
}

export function castVote(pollId: number, optionId: number) {
    return apiPost<string>(`/polls/${pollId}/vote`, { optionId });
}

export function closePoll(pollId: number) {
    return apiPost<string>(`/polls/${pollId}/close`);
}