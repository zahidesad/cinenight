import { apiGet, apiPost } from '@/api/client';

export type UserDto = { id: number; email: string; displayName: string | null; role: string };

export const register = (email: string, password: string, displayName: string) =>
    apiPost<{ email: string; password: string; displayName: string }, UserDto>('/auth/register', {
        email, password, displayName,
    });

export const login = (email: string, password: string) =>
    apiPost<{ email: string; password: string }, UserDto>('/auth/login', { email, password });

export const logout = () => apiPost<{}, string>('/auth/logout', {});

export const forgot = (email: string) =>
    apiPost<{ email: string }, string>('/auth/forgot', { email });

export const resetPassword = (token: string, newPassword: string) =>
    apiPost<{ token: string; newPassword: string }, string>('/auth/reset', { token, newPassword });

export const me = () => apiGet<UserDto | null>('/auth/me');
