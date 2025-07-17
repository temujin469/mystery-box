export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  coins?: number;
  level?: number;
  experience_points?: number;
  role?: UserRole;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  // user: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  coins: number;
  level: number;
  experience_points: number;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  // addressCount?: number;
  // transactionCount?: number;
  // itemCount?: number;
}

export enum UserRole {
  USER = "USER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  coins?: number;
  level?: number;
  experience_points?: number;
  // role?: UserRole;
}

export interface UpdateCoinsData {
  coins: number;
}

export interface UpdateExperienceData {
  experiencePoints: number;
}

export interface UserStats {
  totalDeposits: number;
  totalItems: number;
  totalAddresses: number;
  totalBoxesOpened: number;
}
