const TOKEN_KEY = 'ims_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface JwtUser {
  sub: number;
  email: string;
  role: 'super_admin' | 'university_staff' | 'company_mentor' | 'student';
  universityId?: number;
  isAdmin?: boolean;
  companyId?: number;
  studentId?: number;
  exp: number;
}

export const ROLE_PATHS: Record<string, string> = {
  super_admin: '/admin',
  university_staff: '/university',
  company_mentor: '/company',
  student: '/student',
};

export function decodeToken(token: string): JwtUser | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as JwtUser;
  } catch {
    return null;
  }
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): JwtUser | null {
  const token = getToken();
  if (!token) return null;
  const user = decodeToken(token);
  if (!user || user.exp < Date.now() / 1000) return null;
  return user;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  window.location.href = '/login';
}
