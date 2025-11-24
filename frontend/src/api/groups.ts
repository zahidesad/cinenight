import { apiGet, apiPost } from './client';

export type GroupDto = {
    id: number;
    name: string;
    description?: string;
    visibility: 'PRIVATE' | 'LINK' | 'PUBLIC';
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VISITOR';
};

export type CreateGroupReq = {
    name: string;
    description?: string;
    visibility: 'PRIVATE' | 'LINK' | 'PUBLIC';
};

export function fetchMyGroups() {
    return apiGet<GroupDto[]>('/groups/my');
}

export function fetchExploreGroups() {
    return apiGet<GroupDto[]>('/groups/explore');
}

export function createGroup(data: CreateGroupReq) {
    return apiPost<GroupDto>('/groups', data);
}

export function addMember(groupId: number, email: string, role: 'ADMIN' | 'MEMBER' = 'MEMBER') {
    return apiPost<string>('/groups/add-member', { groupId, email, role });
}

// YENİ: Kendi kendine katılma
export function joinGroup(groupId: number) {
    return apiPost<string>(`/groups/${groupId}/join`);
}