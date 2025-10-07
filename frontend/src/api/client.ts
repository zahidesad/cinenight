export type ApiResponse<T> = { ok: boolean; data?: T; error?: string };

export const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
    try {
        const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });

        if (!res.ok) {
            const msg = res.statusText || String(res.status) || 'HTTP error';
            return { ok: false, error: `${res.status} ${msg}` };
        }
        return (await res.json()) as ApiResponse<T>;
    } catch (e: any) {
        return { ok: false, error: e?.message ?? 'Network error' };
    }
}
