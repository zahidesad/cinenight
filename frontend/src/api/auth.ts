import { apiGet, apiPost, type ApiResponse } from './client';

export type UserDto = {
    id: number;
    email: string;
    displayName: string;
    role: 'USER' | 'ADMIN' | string;
};

const base = '/auth';

export function login(email: string, password: string): Promise<ApiResponse<UserDto>> {
    return apiPost<UserDto>(`${base}/login`, { email, password });
}

export function register(
    email: string,
    password: string,
    displayName: string
): Promise<ApiResponse<UserDto>> {
    return apiPost<UserDto>(`${base}/register`, { email, password, displayName });
}

export function forgot(email: string): Promise<ApiResponse<string>> {
    return apiPost<string>(`${base}/forgot`, { email });
}

export function resetPassword(token: string, newPassword: string): Promise<ApiResponse<string>> {
    return apiPost<string>(`${base}/reset`, { token, newPassword });
}

export function me(): Promise<ApiResponse<UserDto | null>> {
    return apiGet<UserDto | null>(`${base}/me`);
}

export function logout(): Promise<ApiResponse<string>> {
    return apiPost<string>(`${base}/logout`);
}

export const AuthApi = { login, register, forgot, resetPassword, me, logout };