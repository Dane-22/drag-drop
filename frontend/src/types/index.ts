export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type AllocationViewMode = 'day' | 'week' | 'month';

export interface Worker {
  id: number;
  name: string;
  trade: string;
  skill_level?: string;
  status?: string;
  experience?: string;
  profile_photo_url?: string;
  address?: string;
  phone_number?: string;
  created_at?: string;
}

export interface Project {
  id: number;
  site_number: number;
  name: string;
  description: string;
  status?: 'Active' | 'Inactive';
  created_at?: string;
}

export interface Allocation {
  id: number;
  worker_id: number;
  project_id: number;
  day_of_week: DayOfWeek;
  allocation_date: string;
  status?: 'assigned' | 'completed' | 'pending';
  time_stamp?: string;
  worker_name?: string;
  worker_trade?: string;
  worker_photo?: string;
  project_name?: string;
  assigned_by?: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface InitialData {
  workers: Worker[];
  projects: Project[];
  allocations: Allocation[];
}
