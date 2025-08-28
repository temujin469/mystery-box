import { BaseQuery } from "./api-response";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends CreateUserData {
  // Same structure as CreateUserData for user registration
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

// =================== reset password =========================== //
export interface ForgotPasswordData {
  email: string;
}

export interface VerifyResetPinData {
  email: string;
  pin: string;
}

export interface ResetPasswordData {
  email: string;
  pin: string;
  newPassword: string;
}

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}
// ============================================== //

// =================== email update =========================== //
export interface InitiateEmailUpdateData {
  newEmail: string;
  currentPassword: string;
}

export interface VerifyEmailUpdateData {
  verificationPin: string;
}
// =========================================================== //

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
  email_verified: boolean;
  created_at: Date; // Should be Date, not string
  // Relations (when included)
  transactions?: any[]; // Transaction[]
  boxOpenHistory?: any[]; // BoxOpenHistory[]
  items?: any[]; // UserItem[]
  addresses?: any[]; // Address[]
  achievements?: any[]; // UserAchievement[]
  orders?: any[]; // Order[]
}

export enum UserRole {
  USER = "USER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

export interface CreateUserData {
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

export interface UpdateUserData extends Partial<CreateUserData> {
  // Extends CreateUserData with all fields optional for updates
}

export interface UpdateCoinsData {
  coins: number; // Can be positive or negative for adding/subtracting
}

export interface UpdateExperienceData {
  experiencePoints: number;
}

export interface UserStats {
  totalDeposits: number;
  totalItems: number;
  totalAddresses: number;
  totalBoxesOpened: number;
  totalOrders: number;
  level: number;
  experiencePoints: number;
  coinBalance: number;
}

export interface UserQuery extends BaseQuery {
  orderBy?: UserOrderByField;
  search?: string;
  email?: string;
  username?: string;
  minLevel?: number;
  maxLevel?: number;
  minCoins?: number;
  maxCoins?: number;
  role?: UserRole;
}

export enum UserOrderByField {
  ID = "id",
  EMAIL = "email",
  USERNAME = "username",
  FIRSTNAME = "firstname",
  LASTNAME = "lastname",
  COINS = "coins",
  LEVEL = "level",
  EXPERIENCE_POINTS = "experience_points",
  ROLE = "role",
  CREATED_AT = "created_at",
}
