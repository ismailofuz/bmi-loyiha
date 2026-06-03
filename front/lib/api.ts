import { getToken, logout } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });


  if (res.status === 401) {
    logout();
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function requestForm<T>(path: string, body: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', body, headers });
  if (res.status === 401) { logout(); throw new Error('Session expired'); }
  if (!res.ok) {
    const b = await res.json().catch(() => ({}));
    throw new Error((b as { message?: string }).message ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

async function download(path: string, filename: string): Promise<void> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (res.status === 401) { logout(); throw new Error('Session expired'); }
  if (!res.ok) {
    const b = await res.json().catch(() => ({}));
    throw new Error((b as { message?: string }).message ?? 'Yuklab olishda xatolik');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const api = {
  get:      <T>(path: string)                  => request<T>(path),
  post:     <T>(path: string, body: unknown)   => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  postForm: <T>(path: string, body: FormData)  => requestForm<T>(path, body),
  patch:    <T>(path: string, body: unknown)   => request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete:   <T>(path: string)                  => request<T>(path, { method: 'DELETE' }),
  download,
};
