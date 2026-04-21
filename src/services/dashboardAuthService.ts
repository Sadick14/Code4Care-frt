export type DashboardRole = 'admin' | 'counselor';

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: DashboardRole;
  status: 'active' | 'inactive';
  password: string;
  createdAt: string;
}

export interface DashboardSession {
  token: string;
  role: DashboardRole;
  name: string;
  email: string;
}

const STAFF_ACCOUNTS_KEY = 'room1221_staff_accounts';
const DASHBOARD_SESSION_KEY = 'room1221_dashboard_session';

const DEFAULT_ADMIN: StaffAccount = {
  id: 'staff-admin-1',
  name: 'Primary Admin',
  email: 'admin@room1221.org',
  phone: '+233 24 000 0000',
  role: 'admin',
  status: 'active',
  password: 'admin123',
  createdAt: '2026-01-01',
};

function readAccounts(): StaffAccount[] {
  const raw = localStorage.getItem(STAFF_ACCOUNTS_KEY);
  if (!raw) {
    localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }

  try {
    const parsed = JSON.parse(raw) as StaffAccount[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify([DEFAULT_ADMIN]));
      return [DEFAULT_ADMIN];
    }

    const hasAdmin = parsed.some((account) => account.role === 'admin');
    if (!hasAdmin) {
      const seeded = [DEFAULT_ADMIN, ...parsed];
      localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(seeded));
      return seeded;
    }

    return parsed;
  } catch {
    localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
}

function writeAccounts(accounts: StaffAccount[]) {
  localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getStaffAccounts() {
  return readAccounts();
}

export function upsertStaffAccount(payload: {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: DashboardRole;
  status: 'active' | 'inactive';
  password?: string;
}) {
  const accounts = readAccounts();
  const now = new Date().toISOString().split('T')[0];

  if (payload.id) {
    const updated = accounts.map((account) => {
      if (account.id !== payload.id) return account;
      return {
        ...account,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        status: payload.status,
        password: payload.password && payload.password.trim().length > 0 ? payload.password : account.password,
      };
    });
    writeAccounts(updated);
    return;
  }

  const account: StaffAccount = {
    id: `staff-${Date.now()}`,
    name: payload.name,
    email: payload.email.toLowerCase(),
    phone: payload.phone,
    role: payload.role,
    status: payload.status,
    password: payload.password || '',
    createdAt: now,
  };

  writeAccounts([...accounts, account]);
}

export function deleteStaffAccount(id: string) {
  const accounts = readAccounts();
  const next = accounts.filter((account) => account.id !== id);
  writeAccounts(next.length ? next : [DEFAULT_ADMIN]);
}

export function authenticateDashboardUser(email: string, password: string): DashboardSession | null {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password && item.status === 'active'
  );

  if (!account) {
    return null;
  }

  const session: DashboardSession = {
    token: `${account.role}-${Date.now()}`,
    role: account.role,
    name: account.name,
    email: account.email,
  };

  localStorage.setItem(DASHBOARD_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getDashboardSession(): DashboardSession | null {
  const raw = localStorage.getItem(DASHBOARD_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as DashboardSession;
  } catch {
    return null;
  }
}

export function clearDashboardSession() {
  localStorage.removeItem(DASHBOARD_SESSION_KEY);
}
