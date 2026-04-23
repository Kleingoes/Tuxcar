// lib/admin.ts
// Lista de correos con acceso al panel administrativo
export const ADMIN_EMAILS = [
  'kleingoes@gmail.com',
];

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
