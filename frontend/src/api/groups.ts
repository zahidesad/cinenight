import {apiDelete, apiGet, apiPost} from './client';

export type GroupDto = {
    id: number;
    name: string;
    description?: string;
    visibility: 'PRIVATE' | 'LINK' | 'PUBLIC';
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VISITOR';
    memberCount: number;
    inviteToken: string;
};

export type CreateGroupReq = {
    name: string;
    description?: string;
    visibility: 'PRIVATE' | 'LINK' | 'PUBLIC';
};

export type GroupMemberDto = {
    userId: number;
    displayName: string;
    avatarUrl?: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    joinedAt: string;
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

export function joinGroup(groupId: number) {
    return apiPost<string>(`/groups/${groupId}/join`);
}

export function joinGroupByToken(token: string) {
    return apiPost<number>(`/groups/join-token/${token}`);
}

export function fetchGroupMembers(groupId: number) {
    return apiGet<GroupMemberDto[]>(`/groups/${groupId}/members`);
}

export function removeMember(groupId: number, userId: number) {
    return apiDelete<string>(`/groups/${groupId}/members/${userId}`);
}

export function deleteGroup(groupId: number) {
    return apiDelete<string>(`/groups/${groupId}`);
}

export function leaveGroup(groupId: number) {
    return apiPost<string>(`/groups/${groupId}/leave`);
}