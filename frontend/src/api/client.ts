export type ApiResponse<T> = { ok: boolean; data: T | null; error?: string | null };

export const API_BASE: string = (import.meta as any).env?.VITE_API_BASE ?? '/api/v1';

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!res.ok) {
            const msg = res.statusText || String(res.status) || 'HTTP error';
            return { ok: false, error: `${res.status} ${msg}`, data: null };
        }
        return (await res.json()) as ApiResponse<T>;
    } catch (e: any) {
        return { ok: false, error: e?.message ?? 'Network error', data: null };
    }
}

export async function apiPost<TReq, TRes>(path: string, body: TReq): Promise<ApiResponse<TRes>> {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const msg = res.statusText || String(res.status) || 'HTTP error';
            return { ok: false, error: `${res.status} ${msg}`, data: null };
        }
        return (await res.json()) as ApiResponse<TRes>;
    } catch (e: any) {
        return { ok: false, error: e?.message ?? 'Network error', data: null };
    }
}
