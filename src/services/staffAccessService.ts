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
}

const STAFF_ACCOUNTS_KEY = 'room1221_staff_accounts';
const SUPPORT_REQUESTS_KEY = 'room1221_support_requests';
const SESSION_KEY = 'room1221_staff_session';

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

  static deleteStaffAccount(staffId: string) {
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
