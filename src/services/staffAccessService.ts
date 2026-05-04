import { safeStorage } from '@/utils/safeStorage';

export type StaffRole = 'admin' | 'consultant' | 'supervisor' | 'coordinator';
export type StaffStatus = 'active' | 'inactive';
export type StaffAvailability = 'available' | 'busy' | 'offline';
export type SupportRequestStatus = 'waiting' | 'assigned' | 'active' | 'resolved';

export interface StaffAccount {
  id: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  availability: StaffAvailability;
  email: string;
  phone: string;
  joinDate: string;
  trained: boolean;
  currentLoad: number;
  password: string;
}

export interface SupportRequest {
  id: string;
  userId: string;
  userNickname: string;
  userAge: string;
  requestedAt: string;
  status: SupportRequestStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  duration?: number;
}

export interface StaffSession {
  staffId: string;
  name: string;
  role: StaffRole;
  email: string;
  loginAt: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: AdminLoginUser;
}

export interface AdminLoginUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string;
}

export interface AdminLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AdminLoginUser;
}

export interface AdminCreateStaffRequest {
  username: string;
  email: string;
  password: string;
  role: StaffRole;
}

export interface AdminUpdateStaffRequest {
  username: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
}

export interface AdminStaffRecord {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string;
}

export interface AdminStaffListResponse {
  staff: AdminStaffRecord[];
  total: number;
}

export interface AdminDashboardStats {
  total_conversations: number;
  active_sessions_today: number;
  total_messages: number;
  messages_today: number;
  avg_response_time_ms: number;
  safety_flags_today: number;
  escalations_today: number;
  feedback_positive: number;
  feedback_negative: number;
  pending_reports: number;
}

const STAFF_ACCOUNTS_KEY = 'room1221_staff_accounts';
const SUPPORT_REQUESTS_KEY = 'room1221_support_requests';
const SESSION_KEY = 'room1221_staff_session';
const DEFAULT_ADMIN_SEED_KEY = 'room1221_default_admin_seeded';
const ADMIN_API_BASE_URL = (
  import.meta.env.VITE_ADMIN_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).trim();
const ADMIN_BOOTSTRAP_TOKEN = import.meta.env.VITE_ADMIN_BOOTSTRAP_TOKEN?.trim() || '';
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_CREATE_STAFF_PATH = '/admin/staff';
const DEFAULT_ADMIN_ACCOUNT = {
  username: 'System Admin',
  email: 'admin@room1221.org',
  password: 'admin123',
  role: 'admin' as const,
};

function normalizeRole(role: string): StaffRole {
  if (role === 'counselor') {
    return 'consultant';
  }

  if (role === 'admin' || role === 'consultant' || role === 'supervisor' || role === 'coordinator') {
    return role;
  }

  return 'consultant';
}

const defaultStaffAccounts: StaffAccount[] = [
  {
    id: 'staff-admin-1',
    name: 'System Admin',
    role: 'admin',
    status: 'active',
    availability: 'available',
    email: 'admin@room1221.org',
    phone: '+233 30 200 0001',
    joinDate: '2025-01-01',
    trained: true,
    currentLoad: 0,
    password: 'admin123',
  },
  {
    id: 'staff-consultant-1',
    name: 'Sarah Johnson',
    role: 'consultant',
    status: 'active',
    availability: 'available',
    email: 'sarah@room1221.org',
    phone: '+233 24 123 4567',
    joinDate: '2025-01-15',
    trained: true,
    currentLoad: 0,
    password: 'consultant123',
  },
  {
    id: 'staff-supervisor-1',
    name: 'David Mensah',
    role: 'supervisor',
    status: 'active',
    availability: 'busy',
    email: 'david@room1221.org',
    phone: '+233 55 234 5678',
    joinDate: '2024-12-01',
    trained: true,
    currentLoad: 0,
    password: 'supervisor123',
  },
];

const defaultSupportRequests: SupportRequest[] = [
  { id: 'req-1', userId: '1', userNickname: 'SilentThinker', userAge: '16-18', requestedAt: '2 mins ago', status: 'active', assignedStaffId: 'staff-consultant-1', assignedStaffName: 'Sarah Johnson', duration: 2 },
  { id: 'req-2', userId: '2', userNickname: 'BraveHeart', userAge: '19-24', requestedAt: '15 mins ago', status: 'assigned', assignedStaffId: 'staff-supervisor-1', assignedStaffName: 'David Mensah' },
  { id: 'req-3', userId: '6', userNickname: 'HopeSeeker', userAge: '15-18', requestedAt: '5 mins ago', status: 'waiting', duration: 5 },
];

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function computeCurrentLoad(staffId: string, requests: SupportRequest[]) {
  return requests.filter((request) => request.assignedStaffId === staffId && request.status !== 'resolved').length;
}

function withCalculatedLoads(staff: StaffAccount[], requests: SupportRequest[]) {
  return staff.map((member) => ({
    ...member,
    role: normalizeRole(String(member.role)),
    currentLoad: computeCurrentLoad(member.id, requests),
  }));
}

function buildAdminUrl(path: string) {
  if (!ADMIN_API_BASE_URL) {
    return path;
  }

  return new URL(path, ADMIN_API_BASE_URL).toString();
}

async function readApiError(response: Response): Promise<string> {
  const bodyText = await response.text();

  if (!bodyText) {
    return response.statusText || 'Admin login request failed';
  }

  try {
    const parsed = JSON.parse(bodyText) as Record<string, unknown>;

    if (typeof parsed.detail === 'string') {
      return parsed.detail;
    }

    if (Array.isArray(parsed.detail)) {
      return parsed.detail
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return String(item);
          }

          const detail = item as Record<string, unknown>;
          const location = Array.isArray(detail.loc) ? detail.loc.join('.') : '';
          const message = typeof detail.msg === 'string' ? detail.msg : 'Validation error';
          return location ? `${location}: ${message}` : message;
        })
        .join('; ');
    }

    if (typeof parsed.message === 'string') {
      return parsed.message;
    }
  } catch {
    return bodyText;
  }

  return bodyText;
}

function buildAdminHeaders(accessToken?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

function looksLikeAlreadySeeded(errorMessage: string) {
  return /already exists|duplicate|conflict|exists/i.test(errorMessage);
}

function isAdminApiUnavailable(error: unknown) {
  return error instanceof TypeError || (error instanceof Error && /failed to fetch|networkerror|network/i.test(error.message));
}

function mergeRemoteStaffIntoLocal(remoteStaff: AdminStaffRecord[]): StaffAccount[] {
  const existing = parseJson<StaffAccount[]>(safeStorage.getItem(STAFF_ACCOUNTS_KEY), []);

  return withCalculatedLoads(
    remoteStaff.map((member) => {
      const local = existing.find((item) => item.id === member.id || item.email.toLowerCase() === member.email.toLowerCase());

      return {
        id: member.id,
        name: member.username,
        role: normalizeRole(member.role),
        status: member.is_active ? 'active' : 'inactive',
        availability: local?.availability ?? 'available',
        email: member.email,
        phone: local?.phone ?? '',
        joinDate: member.created_at.split('T')[0] || member.created_at,
        trained: local?.trained ?? false,
        currentLoad: local?.currentLoad ?? 0,
        password: local?.password ?? '',
      };
    }),
    existing,
  );
}

function mergeSingleRemoteStaff(member: AdminStaffRecord): StaffAccount {
  const existing = parseJson<StaffAccount[]>(safeStorage.getItem(STAFF_ACCOUNTS_KEY), []);
  const local = existing.find((item) => item.id === member.id || item.email.toLowerCase() === member.email.toLowerCase());

  return {
    id: member.id,
    name: member.username,
    role: normalizeRole(member.role),
    status: member.is_active ? 'active' : 'inactive',
    availability: local?.availability ?? 'available',
    email: member.email,
    phone: local?.phone ?? '',
    joinDate: member.created_at.split('T')[0] || member.created_at,
    trained: local?.trained ?? false,
    currentLoad: local?.currentLoad ?? 0,
    password: local?.password ?? '',
  };
}

function buildLocalDemoSession(email: string, password: string): StaffSession | null {
  const normalizedEmail = email.trim().toLowerCase();
  const account = defaultStaffAccounts.find((member) => {
    return member.email.toLowerCase() === normalizedEmail && member.password === password;
  });

  if (!account || account.status !== 'active' || (account.role !== 'admin' && account.role !== 'consultant')) {
    return null;
  }

  return {
    staffId: account.id,
    name: account.name,
    role: account.role,
    email: account.email,
    loginAt: new Date().toISOString(),
  };
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export class StaffAccessService {
  static getSupportRequests(): SupportRequest[] {
    const stored = parseJson<SupportRequest[]>(safeStorage.getItem(SUPPORT_REQUESTS_KEY), []);

    if (stored.length === 0) {
      safeStorage.setItem(SUPPORT_REQUESTS_KEY, JSON.stringify(defaultSupportRequests));
      return defaultSupportRequests;
    }

    return stored;
  }

  static saveSupportRequests(requests: SupportRequest[]) {
    safeStorage.setItem(SUPPORT_REQUESTS_KEY, JSON.stringify(requests));
    this.syncStaffLoads();
  }

  static getStaffAccounts(): StaffAccount[] {
    const requests = this.getSupportRequests();
    const stored = parseJson<StaffAccount[]>(safeStorage.getItem(STAFF_ACCOUNTS_KEY), []);

    if (stored.length === 0) {
      const seeded = withCalculatedLoads(defaultStaffAccounts, requests);
      safeStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(seeded));
      return seeded;
    }

    const normalized = withCalculatedLoads(stored, requests);
    safeStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(normalized));
    return normalized;
  }

  static saveStaffAccounts(accounts: StaffAccount[]) {
    const requests = this.getSupportRequests();
    const normalized = withCalculatedLoads(accounts, requests);
    safeStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(normalized));
  }

  static async listStaff(accessToken?: string): Promise<StaffAccount[]> {
    if (!accessToken) {
      return this.getStaffAccounts();
    }

    try {
      const response = await fetch(buildAdminUrl(ADMIN_CREATE_STAFF_PATH), {
        method: 'GET',
        headers: buildAdminHeaders(accessToken),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data = await readJsonResponse<AdminStaffListResponse>(response);
      const merged = mergeRemoteStaffIntoLocal(data.staff || []);
      this.saveStaffAccounts(merged);
      return merged;
    } catch (error) {
      if (isAdminApiUnavailable(error)) {
        return this.getStaffAccounts();
      }

      return this.getStaffAccounts();
    }
  }

  static async createStaffAccount(
    payload: {
      name: string;
      email: string;
      phone?: string;
      role: StaffRole;
      password: string;
    },
    accessToken?: string,
  ): Promise<StaffAccount> {
    const username = payload.name.trim();
    const email = payload.email.trim();
    const password = payload.password.trim();

    if (!accessToken) {
      throw new Error('Admin session expired. Please sign in again.');
    }

    if (!username || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    const response = await fetch(buildAdminUrl(ADMIN_CREATE_STAFF_PATH), {
      method: 'POST',
      headers: buildAdminHeaders(accessToken),
      body: JSON.stringify({
        username,
        email,
        password,
        role: payload.role,
      } satisfies AdminCreateStaffRequest),
    });

    if (!response.ok) {
      throw new Error(await readApiError(response));
    }

    const data = (await response.json()) as AdminLoginUser;
    const nextStaff: StaffAccount = {
      id: data.id,
      name: data.username,
      role: normalizeRole(data.role),
      status: data.is_active ? 'active' : 'inactive',
      availability: 'available',
      email: data.email,
      phone: payload.phone?.trim() || '',
      joinDate: data.created_at.split('T')[0] || data.created_at,
      trained: false,
      currentLoad: 0,
      password: '',
    };

    const staff = this.getStaffAccounts();
    const next = [nextStaff, ...staff.filter((member) => member.id !== nextStaff.id)];
    this.saveStaffAccounts(next);

    return nextStaff;
  }

  static async updateStaffAccount(
    staffId: string,
    payload: {
      name: string;
      email: string;
      role: StaffRole;
      isActive?: boolean;
    },
    accessToken?: string,
  ): Promise<StaffAccount> {
    if (!accessToken) {
      throw new Error('Admin session expired. Please sign in again.');
    }

    const response = await fetch(buildAdminUrl(`/admin/staff/${staffId}`), {
      method: 'PUT',
      headers: buildAdminHeaders(accessToken),
      body: JSON.stringify({
        username: payload.name.trim(),
        email: payload.email.trim(),
        role: payload.role,
        is_active: payload.isActive ?? true,
      } satisfies AdminUpdateStaffRequest),
    });

    if (!response.ok) {
      throw new Error(await readApiError(response));
    }

    const data = await readJsonResponse<AdminStaffRecord>(response);
    const nextStaff = mergeSingleRemoteStaff(data);
    const staff = this.getStaffAccounts();
    const updated = [nextStaff, ...staff.filter((member) => member.id !== nextStaff.id)];
    this.saveStaffAccounts(updated);
    return nextStaff;
  }

  static async seedDefaultAdminAccount() {
    if (!ADMIN_BOOTSTRAP_TOKEN) {
      return false;
    }

    if (safeStorage.getItem(DEFAULT_ADMIN_SEED_KEY) === 'true') {
      return true;
    }

    const response = await fetch(buildAdminUrl(ADMIN_CREATE_STAFF_PATH), {
      method: 'POST',
      headers: buildAdminHeaders(ADMIN_BOOTSTRAP_TOKEN),
      body: JSON.stringify(DEFAULT_ADMIN_ACCOUNT),
    });

    if (response.ok) {
      safeStorage.setItem(DEFAULT_ADMIN_SEED_KEY, 'true');
      return true;
    }

    const errorMessage = await readApiError(response);

    if (looksLikeAlreadySeeded(errorMessage)) {
      safeStorage.setItem(DEFAULT_ADMIN_SEED_KEY, 'true');
      return true;
    }

    throw new Error(errorMessage || 'Unable to seed default admin account.');
  }

  static syncStaffLoads() {
    const staff = this.getStaffAccounts();
    const requests = this.getSupportRequests();
    const normalized = withCalculatedLoads(staff, requests);
    safeStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(normalized));
  }

  static upsertStaffAccount(payload: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    role: StaffRole;
    status?: StaffStatus;
    availability?: StaffAvailability;
    trained?: boolean;
    password?: string;
  }) {
    const staff = this.getStaffAccounts();

    if (payload.id) {
      const updated = staff.map((member) => {
        if (member.id !== payload.id) {
          return member;
        }

        return {
          ...member,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: payload.role,
          status: payload.status ?? member.status,
          availability: payload.availability ?? member.availability,
          trained: payload.trained ?? member.trained,
          password: payload.password?.trim() ? payload.password : member.password,
        };
      });

      this.saveStaffAccounts(updated);
      return updated;
    }

    const next: StaffAccount = {
      id: `staff-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      status: payload.status ?? 'active',
      availability: payload.availability ?? 'available',
      trained: payload.trained ?? false,
      password: payload.password || 'change-me',
      joinDate: new Date().toISOString().split('T')[0],
      currentLoad: 0,
    };

    const updated = [...staff, next];
    this.saveStaffAccounts(updated);
    return updated;
  }

  static async deleteStaffAccount(staffId: string, accessToken?: string) {
    if (accessToken) {
      try {
        const response = await fetch(buildAdminUrl(`/admin/staff/${staffId}`), {
          method: 'DELETE',
          headers: buildAdminHeaders(accessToken),
        });

        if (!response.ok) {
          throw new Error(await readApiError(response));
        }
      } catch (error) {
        if (!isAdminApiUnavailable(error)) {
          throw error;
        }
      }
    }

    const staff = this.getStaffAccounts().filter((member) => member.id !== staffId);
    this.saveStaffAccounts(staff);

    const requests = this.getSupportRequests().map((request) => {
      if (request.assignedStaffId !== staffId) {
        return request;
      }

      return {
        ...request,
        status: 'waiting' as const,
        assignedStaffId: undefined,
        assignedStaffName: undefined,
      };
    });

    this.saveSupportRequests(requests);
  }

  static async getDashboardStats(accessToken?: string): Promise<AdminDashboardStats | null> {
    if (!accessToken) {
      return null;
    }

    try {
      const response = await fetch(buildAdminUrl('/admin/dashboard'), {
        method: 'GET',
        headers: buildAdminHeaders(accessToken),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<AdminDashboardStats>(response);
    } catch (error) {
      if (isAdminApiUnavailable(error)) {
        return null;
      }

      return null;
    }
  }

  static verifyCredentials(email: string, password: string): StaffSession | null {
    const normalizedEmail = email.trim().toLowerCase();
    const account = this.getStaffAccounts().find((member) => {
      return member.email.toLowerCase() === normalizedEmail && member.password === password;
    });

    if (!account) {
      return null;
    }

    if (account.status !== 'active') {
      return null;
    }

    if (account.role !== 'admin' && account.role !== 'consultant') {
      return null;
    }

    const session: StaffSession = {
      staffId: account.id,
      name: account.name,
      role: account.role,
      email: account.email,
      loginAt: new Date().toISOString(),
    };

    return session;
  }

  static async login(email: string, password: string): Promise<StaffSession> {
    const normalizedEmail = email.trim();
    const normalizedPassword = password;

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error('Please enter both email and password.');
    }

    try {
      const response = await fetch(buildAdminUrl(ADMIN_LOGIN_PATH), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: normalizedPassword,
        }),
      });

      if (!response.ok) {
        const errorMessage = await readApiError(response);

        if (response.status === 404 || response.status === 405) {
          const localSession = this.verifyCredentials(normalizedEmail, normalizedPassword);

          if (localSession) {
            return localSession;
          }

          const demoSession = buildLocalDemoSession(normalizedEmail, normalizedPassword);

          if (demoSession) {
            return demoSession;
          }
        }

        throw new Error(errorMessage || 'Admin login request failed');
      }

      const data = (await response.json()) as AdminLoginResponse;
      const role = normalizeRole(data.user.role);

      if (role !== 'admin' && role !== 'consultant') {
        throw new Error('Role not permitted for dashboard access.');
      }

      if (!data.user.is_active) {
        throw new Error('Account is inactive.');
      }

      return {
        staffId: data.user.id,
        name: data.user.username || data.user.email,
        role,
        email: data.user.email,
        loginAt: new Date().toISOString(),
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        user: data.user,
      };
    } catch (error) {
      const localSession = this.verifyCredentials(normalizedEmail, normalizedPassword);

      if (localSession) {
        return localSession;
      }

      const demoSession = buildLocalDemoSession(normalizedEmail, normalizedPassword);

      if (demoSession) {
        return demoSession;
      }

      throw error instanceof Error ? error : new Error('Admin login request failed');
    }
  }

  static setSession(session: StaffSession) {
    safeStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  static getSession(): StaffSession | null {
    const raw = safeStorage.getItem(SESSION_KEY);
    return parseJson<StaffSession | null>(raw, null);
  }

  static clearSession() {
    safeStorage.removeItem(SESSION_KEY);
  }
}
