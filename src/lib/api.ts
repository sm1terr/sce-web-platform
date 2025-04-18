import {
  ApiResponse,
  LoginData,
  Post,
  RegisterData,
  SCEObject,
  User,
  VerifyEmailData
} from "@/types";

// This is a mock API service for demonstration
// In a real application, you would connect to a backend server

const LOCAL_STORAGE_USER_KEY = "sce-user";
const LOCAL_STORAGE_OBJECTS_KEY = "sce-objects";
const LOCAL_STORAGE_POSTS_KEY = "sce-posts";
const LOCAL_STORAGE_USERS_KEY = "sce-users";

// Get data from localStorage
const getLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error getting data from localStorage: ${key}`, error);
    return defaultValue;
  }
};

// Save data to localStorage
const saveLocalData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage: ${key}`, error);
  }
};

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  return getLocalData<User | null>(LOCAL_STORAGE_USER_KEY, null);
};

// Save current authenticated user
export const saveCurrentUser = (user: User | null): void => {
  saveLocalData(LOCAL_STORAGE_USER_KEY, user);
};

// Login
export const login = async (data: LoginData): Promise<ApiResponse<User>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  const user = users.find(u => u.email === data.email);
  
  if (!user) {
    return { success: false, error: "Пользователь не найден" };
  }
  
  // In a real application, you would hash and verify passwords
  // This is just for demonstration
  if (data.password !== "password") {
    return { success: false, error: "Неверный пароль" };
  }
  
  if (!user.isEmailVerified) {
    return { success: false, error: "Подтвердите свой адрес электронной почты" };
  }
  
  saveCurrentUser(user);
  return { success: true, data: user, message: "Вход выполнен успешно" };
};

// Register
export const register = async (data: RegisterData): Promise<ApiResponse<User>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  
  if (users.some(u => u.email === data.email)) {
    return { success: false, error: "Этот email уже используется" };
  }
  
  if (users.some(u => u.username === data.username)) {
    return { success: false, error: "Это имя пользователя уже занято" };
  }
  
  if (data.password !== data.confirmPassword) {
    return { success: false, error: "Пароли не совпадают" };
  }
  
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: data.email,
    username: data.username,
    role: users.length === 0 ? "ADMIN" : "READER", // First user is admin, others are readers
    createdAt: new Date().toISOString(),
    isEmailVerified: false
  };
  
  const updatedUsers = [...users, newUser];
  saveLocalData(LOCAL_STORAGE_USERS_KEY, updatedUsers);
  
  // Don't log in the user until email is verified
  return { 
    success: true, 
    data: newUser, 
    message: "Регистрация успешна. Проверьте вашу почту для подтверждения." 
  };
};

// Verify email
export const verifyEmail = async (data: VerifyEmailData): Promise<ApiResponse<User>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  
  // In a real app, you would validate a real token
  // Here we just set any user with unverified email to verified
  const userIndex = users.findIndex(u => !u.isEmailVerified);
  
  if (userIndex === -1) {
    return { success: false, error: "Неверный или истекший токен" };
  }
  
  const updatedUser = {
    ...users[userIndex],
    isEmailVerified: true
  };
  
  const updatedUsers = [
    ...users.slice(0, userIndex),
    updatedUser,
    ...users.slice(userIndex + 1)
  ];
  
  saveLocalData(LOCAL_STORAGE_USERS_KEY, updatedUsers);
  saveCurrentUser(updatedUser);
  
  return { 
    success: true, 
    data: updatedUser, 
    message: "Email подтвержден. Вы вошли в систему." 
  };
};

// Logout
export const logout = async (): Promise<ApiResponse<null>> => {
  saveCurrentUser(null);
  return { success: true, message: "Выход выполнен успешно" };
};

// Get SCE objects
export const getSCEObjects = async (): Promise<ApiResponse<SCEObject[]>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const objects = getLocalData<SCEObject[]>(LOCAL_STORAGE_OBJECTS_KEY, []);
  return { success: true, data: objects };
};

// Get SCE object by ID
export const getSCEObjectById = async (id: string): Promise<ApiResponse<SCEObject>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const objects = getLocalData<SCEObject[]>(LOCAL_STORAGE_OBJECTS_KEY, []);
  const object = objects.find(o => o.id === id);
  
  if (!object) {
    return { success: false, error: "Объект не найден" };
  }
  
  return { success: true, data: object };
};

// Create SCE object
export const createSCEObject = async (object: Omit<SCEObject, "id" | "createdAt" | "updatedAt" | "createdBy">): Promise<ApiResponse<SCEObject>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== "ADMIN") {
    return { success: false, error: "У вас нет прав для создания объектов" };
  }
  
  const objects = getLocalData<SCEObject[]>(LOCAL_STORAGE_OBJECTS_KEY, []);
  
  const newObject: SCEObject = {
    ...object,
    id: `sce-${Date.now()}`,
    createdBy: currentUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedObjects = [...objects, newObject];
  saveLocalData(LOCAL_STORAGE_OBJECTS_KEY, updatedObjects);
  
  return { success: true, data: newObject, message: "Объект успешно создан" };
};

// Update SCE object
export const updateSCEObject = async (id: string, updates: Partial<SCEObject>): Promise<ApiResponse<SCEObject>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== "ADMIN") {
    return { success: false, error: "У вас нет прав для обновления объектов" };
  }
  
  const objects = getLocalData<SCEObject[]>(LOCAL_STORAGE_OBJECTS_KEY, []);
  const objectIndex = objects.findIndex(o => o.id === id);
  
  if (objectIndex === -1) {
    return { success: false, error: "Объект не найден" };
  }
  
  const updatedObject = {
    ...objects[objectIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  const updatedObjects = [
    ...objects.slice(0, objectIndex),
    updatedObject,
    ...objects.slice(objectIndex + 1)
  ];
  
  saveLocalData(LOCAL_STORAGE_OBJECTS_KEY, updatedObjects);
  
  return { success: true, data: updatedObject, message: "Объект успешно обновлен" };
};

// Delete SCE object
export const deleteSCEObject = async (id: string): Promise<ApiResponse<null>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== "ADMIN") {
    return { success: false, error: "У вас нет прав для удаления объектов" };
  }
  
  const objects = getLocalData<SCEObject[]>(LOCAL_STORAGE_OBJECTS_KEY, []);
  const updatedObjects = objects.filter(o => o.id !== id);
  
  saveLocalData(LOCAL_STORAGE_OBJECTS_KEY, updatedObjects);
  
  return { success: true, message: "Объект успешно удален" };
};

// Get posts
export const getPosts = async (): Promise<ApiResponse<Post[]>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const posts = getLocalData<Post[]>(LOCAL_STORAGE_POSTS_KEY, []);
  return { success: true, data: posts };
};

// Get post by ID
export const getPostById = async (id: string): Promise<ApiResponse<Post>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const posts = getLocalData<Post[]>(LOCAL_STORAGE_POSTS_KEY, []);
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return { success: false, error: "Публикация не найдена" };
  }
  
  return { success: true, data: post };
};

// Create post
export const createPost = async (post: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId" | "authorName">): Promise<ApiResponse<Post>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== "ADMIN") {
    return { success: false, error: "У вас нет прав для создания публикаций" };
  }
  
  const posts = getLocalData<Post[]>(LOCAL_STORAGE_POSTS_KEY, []);
  
  const newPost: Post = {
    ...post,
    id: `post-${Date.now()}`,
    authorId: currentUser.id,
    authorName: currentUser.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedPosts = [...posts, newPost];
  saveLocalData(LOCAL_STORAGE_POSTS_KEY, updatedPosts);
  
  return { success: true, data: newPost, message: "Публикация успешно создана" };
};

// Update post
export const updatePost = async (id: string, updates: Partial<Post>): Promise<ApiResponse<Post>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== "ADMIN") {
    return { success: false, error: "У вас нет прав для обновления публикаций" };
  }
  
  const posts = getLocalData<Post[]>(LOCAL_STORAGE_POSTS_KEY, []);
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return { success: false, error: "Публикация не найдена" };
  }
  
  const updatedPost = {
    ...posts[postIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  const updatedPosts = [
    ...posts.slice(0, postIndex),
    updatedPost,
    ...posts.slice(postIndex + 1)
  ];
  
  saveLocalData(LOCAL_STORAGE_POSTS_KEY, updatedPosts);
  
  return { success: true, data: updatedPost, message: "Публикация успешно обновлена" };
};

// Delete post
export const deletePost = async (id: string): Promise<ApiResponse<null>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== "ADMIN") {
    return { success: false, error: "У вас нет прав для удаления публикаций" };
  }
  
  const posts = getLocalData<Post[]>(LOCAL_STORAGE_POSTS_KEY, []);
  const updatedPosts = posts.filter(p => p.id !== id);
  
  saveLocalData(LOCAL_STORAGE_POSTS_KEY, updatedPosts);
  
  return { success: true, message: "Публикация успешно удалена" };
};

// Get all users (admin only)
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== "ADMIN") {
    return { success: false, error: "У вас нет прав для просмотра пользователей" };
  }
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  return { success: true, data: users };
};

// Update user role (admin only)
export const updateUserRole = async (id: string, role: string): Promise<ApiResponse<User>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== "ADMIN") {
    return { success: false, error: "У вас нет прав для изменения ролей" };
  }
  
  if (id === currentUser.id) {
    return { success: false, error: "Вы не можете изменить свою роль" };
  }
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return { success: false, error: "Пользователь не найден" };
  }
  
  const updatedUser = {
    ...users[userIndex],
    role
  };
  
  const updatedUsers = [
    ...users.slice(0, userIndex),
    updatedUser,
    ...users.slice(userIndex + 1)
  ];
  
  saveLocalData(LOCAL_STORAGE_USERS_KEY, updatedUsers);
  
  return { success: true, data: updatedUser, message: "Роль пользователя успешно обновлена" };
};
