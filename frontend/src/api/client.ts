export type ApiResponse<T> = { ok: boolean; data: T | null; error?: string | null };

export const API_BASE: string = (import.meta as any).env?.VITE_API_BASE ?? '/api/v1';

async function readJsonSafe(res: Response) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
        try { return await res.json(); } catch { /* yut */ }
    }
    return null;
}

export async function apiGet<T>(path: string) {
    try {
        const res = await fetch(`${API_BASE}${path}`, { method: 'GET', credentials: 'include' });
        const body = await readJsonSafe(res) as ApiResponse<T> | null;
        if (!res.ok) {
            const err = (body && typeof body.error === 'string') ? body.error : `${res.status} ${res.statusText || 'HTTP error'}`;
            return { ok: false, error: err, data: null } as ApiResponse<T>;
        }
        return (body ?? { ok: true, data: null, error: null }) as ApiResponse<T>;
    } catch (e: any) {
        return { ok: false, error: e?.message ?? 'Network error', data: null } as ApiResponse<T>;
    }
}

export async function apiPost<TReq, TRes>(path: string, body: TReq) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        });
        const json = await readJsonSafe(res) as ApiResponse<TRes> | null;
        if (!res.ok) {
            const err = (json && typeof json.error === 'string') ? json.error : `${res.status} ${res.statusText || 'HTTP error'}`;
            return { ok: false, error: err, data: null } as ApiResponse<TRes>;
        }
        return (json ?? { ok: true, data: null, error: null }) as ApiResponse<TRes>;
    } catch (e: any) {
        return { ok: false, error: e?.message ?? 'Network error', data: null } as ApiResponse<TRes>;
    }
}
