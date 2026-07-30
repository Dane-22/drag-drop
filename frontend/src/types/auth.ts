export type UserRole = 'engineer' | 'admin' | 'super_admin';

export type NavPageId =
  | 'site_allocation'
  | 'site_management'
  | 'employee_list'
  | 'settings'
  | 'documents'
  | 'user_management';

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  token?: string;
}

export interface SystemUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  created_at: string;
}
