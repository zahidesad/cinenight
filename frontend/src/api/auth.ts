import { apiGet, apiPost } from '@/api/client';

export type UserDto = { id: number; email: string; displayName: string | null; role: string };

export const register = (email: string, password: string, displayName: string) =>
    apiPost<{ email: string; password: string; displayName: string }, UserDto>('/auth/register', {
        email, password, displayName,
    });

export async function login(email: string, password: string) {
    const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        let uiMessage = 'E-posta veya şifre yanlış.';
        if (data.code === 'ACCOUNT_DISABLED') uiMessage = 'Hesabın devre dışı.';
        if (data.code === 'ACCOUNT_LOCKED') uiMessage = 'Hesabın kilitli.';

        return { ok: false, error: uiMessage, status: res.status, code: data.code };
    }

    return { ok: true, data };
}

export const logout = () => apiPost<{}, string>('/auth/logout', {});

export const forgot = (email: string) =>
    apiPost<{ email: string }, string>('/auth/forgot', { email });

export const resetPassword = (token: string, newPassword: string) =>
    apiPost<{ token: string; newPassword: string }, string>('/auth/reset', { token, newPassword });

export const me = () => apiGet<UserDto | null>('/auth/me');
