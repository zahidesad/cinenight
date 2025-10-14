export type ApiResponse<T> = { ok: boolean; data: T | null; error: string | null };

const BASE = '/api/v1';

async function handle<T>(res: Response): Promise<ApiResponse<T>> {
    try {
        const body = await res.json();
        // Backend zaten { ok, data, error } döndürüyor
        return body as ApiResponse<T>;
    } catch {
        return { ok: false, data: null, error: 'Geçersiz cevap' };
    }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE}${path}`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        ...init,
    });
    return handle<T>(res);
}

export async function apiPost<T, B = unknown>(
    path: string,
    body?: B,
    init?: RequestInit
): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...init,
    });
    return handle<T>(res);
}

// Uyum için (isteğe bağlı): başka yerlerde "import { api }" kullanıldıysa çalışsın
export const api = {
    get: apiGet as <T>(path: string, init?: RequestInit) => Promise<ApiResponse<T>>,
    post: apiPost as <T, B = unknown>(
        path: string,
        body?: B,
        init?: RequestInit
    ) => Promise<ApiResponse<T>>,
};
