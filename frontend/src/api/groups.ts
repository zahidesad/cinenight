import { apiGet, apiPost } from './client';

export type GroupDto = {
    id: number;
    name: string;
    description?: string;
    visibility: 'PRIVATE' | 'LINK';
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
};

export type CreateGroupReq = {
    name: string;
    description?: string;
};

export function fetchMyGroups() {
    return apiGet<GroupDto[]>('/groups/my');
}

export function createGroup(data: CreateGroupReq) {
    return apiPost<GroupDto>('/groups', data);
}

export function addMember(groupId: number, email: string, role: 'ADMIN' | 'MEMBER' = 'MEMBER') {
    return apiPost<string>('/groups/add-member', { groupId, email, role });
}