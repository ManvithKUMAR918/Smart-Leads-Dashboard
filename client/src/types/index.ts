// ─── Enums (as const objects for erasableSyntaxOnly) ─────
export const LeadStatus = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  LOST: 'Lost',
} as const;
export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export const LeadSource = {
  WEBSITE: 'Website',
  INSTAGRAM: 'Instagram',
  REFERRAL: 'Referral',
} as const;
export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

export const UserRole = {
  ADMIN: 'admin',
  SALES: 'sales',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ─── User Types ──────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ─── Lead Types ──────────────────────────────────────────
export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadData {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

// ─── API Response Types ──────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── Query Types ─────────────────────────────────────────
export interface LeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sortBy?: 'latest' | 'oldest';
}

// ─── Auth Types ──────────────────────────────────────────
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// ─── Context Types ───────────────────────────────────────
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
