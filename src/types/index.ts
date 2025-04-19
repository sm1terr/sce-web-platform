export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  isEmailVerified: boolean;
  clearanceLevel?: ClearanceLevel;
  position?: string;
  department?: Department;
  avatarUrl?: string;
  bio?: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  RESEARCHER = "RESEARCHER",
  SECURITY = "SECURITY",
  EXPLORER = "EXPLORER",
  READER = "READER"
}

export enum ClearanceLevel {
  LEVEL_1 = "LEVEL_1",
  LEVEL_2 = "LEVEL_2",
  LEVEL_3 = "LEVEL_3",
  LEVEL_4 = "LEVEL_4",
  LEVEL_5 = "LEVEL_5"
}

export enum Department {
  RESEARCH = "RESEARCH",
  SECURITY = "SECURITY",
  OPERATIONS = "OPERATIONS",
  ADMINISTRATION = "ADMINISTRATION",
  ETHICS = "ETHICS",
  CONTAINMENT = "CONTAINMENT",
  EXPLORATION = "EXPLORATION"
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
  discoveryLocation?: string;
  discoveryDate?: string;
  discoveredBy?: string;
  requiredClearance: ClearanceLevel;
  associatedThreats?: string[];
  relatedObjects?: string[];
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
  tags?: string[];
  authorId: string;
  authorName: string;
  clearanceRequired?: ClearanceLevel;
  summary?: string;
  relatedObjects?: string[];
  relatedPosts?: string[];
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PostCategory {
  NEWS = "NEWS",
  ARTICLE = "ARTICLE",
  REPORT = "REPORT",
  MEMO = "MEMO",
  BRIEFING = "BRIEFING",
  EVENT = "EVENT",
  INTERVIEW = "INTERVIEW"
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

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: UserRole;
  clearanceLevel?: ClearanceLevel;
  position?: string;
  department?: Department;
  avatarUrl?: string;
  bio?: string;
}

export interface CreateObjectData {
  title: string;
  objectClass: ObjectClass;
  number: string;
  containmentProcedures: string;
  description: string;
  additionalNotes?: string;
  discoveryLocation?: string;
  discoveryDate?: string;
  discoveredBy?: string;
  requiredClearance: ClearanceLevel;
  associatedThreats?: string[];
  relatedObjects?: string[];
  images?: string[];
}

export interface CreatePostData {
  title: string;
  content: string;
  category: PostCategory;
  tags?: string[];
  clearanceRequired?: ClearanceLevel;
  summary?: string;
  relatedObjects?: string[];
  relatedPosts?: string[];
  featuredImage?: string;
}
