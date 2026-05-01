// lib/admin.ts

const SUPER_ADMIN_EMAILS = [
  'klein.lopez03@unach.mx',
];

const EMPLOYEE_EMAILS = [
  'kleingoes@gmail.com',
];

export type UserRole = 'super_admin' | 'employee' | 'client';

export function getUserRole(email?: string | null): UserRole {
  if (!email) return 'client';
  const lower = email.toLowerCase();
  if (SUPER_ADMIN_EMAILS.includes(lower)) return 'super_admin';
  if (EMPLOYEE_EMAILS.includes(lower)) return 'employee';
  return 'client';
}

export function isStaff(email?: string | null): boolean {
  const role = getUserRole(email);
  return role === 'super_admin' || role === 'employee';
}

export function isSuperAdmin(email?: string | null): boolean {
  return getUserRole(email) === 'super_admin';
}
