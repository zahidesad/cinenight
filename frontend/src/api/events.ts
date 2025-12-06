import { apiGet, apiPost } from './client';

export type EventDto = {
    id: number;
    title: string;
    movieTitle?: string;
    tmdbId?: number;
    startTime: string;
    endTime?: string;
    locationText?: string;
    locationUrl?: string;
    status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
    myRsvp?: 'YES' | 'NO' | 'MAYBE' | null;
};

export type RsvpStatus = 'YES' | 'NO' | 'MAYBE';

export function fetchGroupEvents(groupId: number) {
    return apiGet<EventDto[]>(`/groups/${groupId}/events`);
}

export function rsvpEvent(eventId: number, status: RsvpStatus) {
    return apiPost<string>(`/events/${eventId}/rsvp`, { status });
}

export function createEvent(data: {
    groupId: number;
    title: string;
    tmdbId?: number;
    startTime: string; // ISO
    locationText?: string;
}) {
    return apiPost('/events', data);
}