export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  isEmailVerified: boolean;
}

export enum UserRole {
  ADMIN = "ADMIN",
  RESEARCHER = "RESEARCHER",
  SECURITY = "SECURITY",
  EXPLORER = "EXPLORER",
  READER = "READER"
}

export interface SCEObject {
  id: string;
  number: string;
  title: string;
  objectClass: ObjectClass;
  containmentProcedures: string;
  description: string;
  additionalNotes?: string;
  images?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export enum ObjectClass {
  SAFE = "SAFE",
  EUCLID = "EUCLID",
  KETER = "KETER",
  THAUMIEL = "THAUMIEL",
  NEUTRALIZED = "NEUTRALIZED",
  EXPLAINED = "EXPLAINED"
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export enum PostCategory {
  NEWS = "NEWS",
  ARTICLE = "ARTICLE",
  REPORT = "REPORT",
  MEMO = "MEMO"
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
