import {
  ApiResponse,
  ClearanceLevel,
  CreateObjectData,
  CreatePostData,
  Department,
  LoginData,
  Post,
  PostCategory,
  RegisterData,
  SCEObject,
  UpdateUserData,
  User,
  UserRole,
  VerifyEmailData
} from "@/types";

// Ключи для локального хранилища
const LOCAL_STORAGE_USER_KEY = "sce-current-user";
const LOCAL_STORAGE_OBJECTS_KEY = "sce-objects";
const LOCAL_STORAGE_POSTS_KEY = "sce-posts";
const LOCAL_STORAGE_USERS_KEY = "sce-users";

// Получение данных из localStorage
const getLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Ошибка получения данных из localStorage: ${key}`, error);
    return defaultValue;
  }
};

// Сохранение данных в localStorage
const saveLocalData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Ошибка сохранения данных в localStorage: ${key}`, error);
  }
};

// Получение текущего аутентифицированного пользователя
export const getCurrentUser = (): User | null => {
  return getLocalData<User | null>(LOCAL_STORAGE_USER_KEY, null);
};

// Сохранение текущего аутентифицированного пользователя
export const saveCurrentUser = (user: User | null): void => {
  saveLocalData(LOCAL_STORAGE_USER_KEY, user);
};

// Вход в систему
export const login = async (data: LoginData): Promise<ApiResponse<User>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  const user = users.find(u => u.email === data.email);
  
  if (!user) {
    return { success: false, error: "Пользователь не найден" };
  }
  
  // В реальном приложении вы бы хэшировали и проверяли пароли
  // Для artemkauniti@gmail.com используем указанный пароль
  if (data.email === "artemkauniti@gmail.com" && data.password !== "Vmpgg2123") {
    return { success: false, error: "Неверный пароль" };
  } else if (data.email !== "artemkauniti@gmail.com" && data.password !== "password") {
    return { success: false, error: "Неверный пароль" };
  }
  
  if (!user.isEmailVerified) {
    return { success: false, error: "Пожалуйста, подтвердите свой адрес электронной почты перед входом в систему" };
  }
  
  saveCurrentUser(user);
  return { success: true, data: user, message: "Вход выполнен успешно" };
};

// Регистрация
export const register = async (data: RegisterData): Promise<ApiResponse<User>> => {
  // Имитация задержки API
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
  
  // Определяем роль - первый пользователь получает роль ADMIN
  const role = users.length === 0 ? UserRole.ADMIN : UserRole.READER;
  
  // Создаем нового пользователя
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: data.email,
    username: data.username,
    role: role,
    clearanceLevel: role === UserRole.ADMIN ? ClearanceLevel.LEVEL_5 : ClearanceLevel.LEVEL_1,
    department: role === UserRole.ADMIN ? Department.ADMINISTRATION : undefined,
    position: role === UserRole.ADMIN ? "Директор Фонда" : "Новый сотрудник",
    createdAt: new Date().toISOString(),
    isEmailVerified: false
  };
  
  const updatedUsers = [...users, newUser];
  saveLocalData(LOCAL_STORAGE_USERS_KEY, updatedUsers);
  
  // В реальном приложении здесь бы отправлялось письмо для подтверждения
  // Не входим в систему, пока email не подтвержден
  return { 
    success: true, 
    data: newUser, 
    message: "Регистрация успешна. Пожалуйста, проверьте вашу электронную почту для подтверждения." 
  };
};

// Подтверждение email
export const verifyEmail = async (data: VerifyEmailData): Promise<ApiResponse<User>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  
  // В реальном приложении здесь была бы валидация настоящего токена
  // Здесь мы просто находим первого пользователя с неподтвержденным email
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
    message: "Email успешно подтвержден. Вы вошли в систему." 
  };
};

// Обновление профиля пользователя
export const updateUserProfile = async (userId: string, data: UpdateUserData): Promise<ApiResponse<User>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.id !== userId && currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "У вас нет прав для изменения этого профиля" };
  }
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, error: "Пользователь не найден" };
  }
  
  // Проверяем, не пытается ли пользователь изменить роль, не являясь администратором
  if (data.role && currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "Только администраторы могут изменять роли" };
  }
  
  // Проверяем, не пытается ли пользователь изменить уровень доступа, не являясь администратором
  if (data.clearanceLevel && currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "Только администраторы могут изменять уровни доступа" };
  }
  
  const updatedUser = {
    ...users[userIndex],
    ...data
  };
  
  const updatedUsers = [
    ...users.slice(0, userIndex),
    updatedUser,
    ...users.slice(userIndex + 1)
  ];
  
  saveLocalData(LOCAL_STORAGE_USERS_KEY, updatedUsers);
  
  // Если обновляем текущего пользователя, то обновляем и данные текущей сессии
  if (currentUser.id === userId) {
    saveCurrentUser(updatedUser);
  }
  
  return { 
    success: true, 
    data: updatedUser, 
    message: "Профиль успешно обновлен" 
  };
};

// Выход из системы
export const logout = async (): Promise<ApiResponse<null>> => {
  saveCurrentUser(null);
  return { success: true, message: "Выход выполнен успешно" };
};

// Получение всех объектов SCE
export const getSCEObjects = async (): Promise<ApiResponse<SCEObject[]>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  const objects = getLocalData<SCEObject[]>(LOCAL_STORAGE_OBJECTS_KEY, []);
  
  // Фильтрация объектов в зависимости от уровня доступа текущего пользователя
  let accessibleObjects = objects;
  
  if (currentUser) {
    const clearanceLevelMap = {
      [ClearanceLevel.LEVEL_1]: 1,
      [ClearanceLevel.LEVEL_2]: 2,
      [ClearanceLevel.LEVEL_3]: 3,
      [ClearanceLevel.LEVEL_4]: 4,
      [ClearanceLevel.LEVEL_5]: 5,
    };
    
    const userClearanceLevel = currentUser.clearanceLevel 
      ? clearanceLevelMap[currentUser.clearanceLevel] 
      : 1;
    
    accessibleObjects = objects.filter(obj => {
      const objectClearanceLevel = obj.requiredClearance 
        ? clearanceLevelMap[obj.requiredClearance] 
        : 1;
      
      return userClearanceLevel >= objectClearanceLevel;
    });
  } else {
    // Неавторизованные пользователи видят только объекты с уровнем доступа 1
    accessibleObjects = objects.filter(obj => obj.requiredClearance === ClearanceLevel.LEVEL_1);
  }
  
  return { success: true, data: accessibleObjects };
};

// Получение объекта SCE по ID
export const getSCEObjectById = async (id: string): Promise<ApiResponse<SCEObject>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  const objects = getLocalData<SCEObject[]>(LOCAL_STORAGE_OBJECTS_KEY, []);
  const object = objects.find(o => o.id === id);
  
  if (!object) {
    return { success: false, error: "Объект не найден" };
  }
  
  // Проверка уровня доступа
  if (currentUser) {
    const clearanceLevelMap = {
      [ClearanceLevel.LEVEL_1]: 1,
      [ClearanceLevel.LEVEL_2]: 2,
      [ClearanceLevel.LEVEL_3]: 3,
      [ClearanceLevel.LEVEL_4]: 4,
      [ClearanceLevel.LEVEL_5]: 5,
    };
    
    const userClearanceLevel = currentUser.clearanceLevel 
      ? clearanceLevelMap[currentUser.clearanceLevel] 
      : 1;
    
    const objectClearanceLevel = object.requiredClearance 
      ? clearanceLevelMap[object.requiredClearance] 
      : 1;
    
    if (userClearanceLevel < objectClearanceLevel) {
      return { 
        success: false, 
        error: `Доступ запрещен. Требуется уровень доступа ${object.requiredClearance}.` 
      };
    }
  } else if (object.requiredClearance !== ClearanceLevel.LEVEL_1) {
    return { 
      success: false, 
      error: "Доступ запрещен. Требуется авторизация." 
    };
  }
  
  return { success: true, data: object };
};

// Создание объекта SCE
export const createSCEObject = async (objectData: CreateObjectData): Promise<ApiResponse<SCEObject>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "У вас нет прав для создания объектов" };
  }
  
  const objects = getLocalData<SCEObject[]>(LOCAL_STORAGE_OBJECTS_KEY, []);
  
  // Проверяем, не существует ли уже объект с таким номером
  if (objects.some(o => o.number === objectData.number)) {
    return { success: false, error: `Объект SCE-${objectData.number} уже существует` };
  }
  
  // Создаем новый объект
  const newObject: SCEObject = {
    id: `sce-obj-${Date.now()}`,
    ...objectData,
    createdBy: currentUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedObjects = [...objects, newObject];
  saveLocalData(LOCAL_STORAGE_OBJECTS_KEY, updatedObjects);
  
  return { success: true, data: newObject, message: "Объект SCE успешно создан" };
};

// Обновление объекта SCE
export const updateSCEObject = async (id: string, updates: Partial<SCEObject>): Promise<ApiResponse<SCEObject>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
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
  
  return { success: true, data: updatedObject, message: "Объект SCE успешно обновлен" };
};

// Удаление объекта SCE
export const deleteSCEObject = async (id: string): Promise<ApiResponse<null>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "У вас нет прав для удаления объектов" };
  }
  
  const objects = getLocalData<SCEObject[]>(LOCAL_STORAGE_OBJECTS_KEY, []);
  const updatedObjects = objects.filter(o => o.id !== id);
  
  saveLocalData(LOCAL_STORAGE_OBJECTS_KEY, updatedObjects);
  
  return { success: true, message: "Объект SCE успешно удален" };
};

// Получение всех публикаций
export const getPosts = async (): Promise<ApiResponse<Post[]>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  const posts = getLocalData<Post[]>(LOCAL_STORAGE_POSTS_KEY, []);
  
  // Фильтрация публикаций в зависимости от уровня доступа текущего пользователя
  let accessiblePosts = posts;
  
  if (currentUser) {
    const clearanceLevelMap = {
      [ClearanceLevel.LEVEL_1]: 1,
      [ClearanceLevel.LEVEL_2]: 2,
      [ClearanceLevel.LEVEL_3]: 3,
      [ClearanceLevel.LEVEL_4]: 4,
      [ClearanceLevel.LEVEL_5]: 5,
    };
    
    const userClearanceLevel = currentUser.clearanceLevel 
      ? clearanceLevelMap[currentUser.clearanceLevel] 
      : 1;
    
    accessiblePosts = posts.filter(post => {
      if (!post.clearanceRequired) return true;
      
      const postClearanceLevel = clearanceLevelMap[post.clearanceRequired];
      return userClearanceLevel >= postClearanceLevel;
    });
  } else {
    // Неавторизованные пользователи видят только публикации без требований к уровню доступа
    accessiblePosts = posts.filter(post => !post.clearanceRequired || post.clearanceRequired === ClearanceLevel.LEVEL_1);
  }
  
  return { success: true, data: accessiblePosts };
};

// Получение публикации по ID
export const getPostById = async (id: string): Promise<ApiResponse<Post>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  const posts = getLocalData<Post[]>(LOCAL_STORAGE_POSTS_KEY, []);
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return { success: false, error: "Публикация не найдена" };
  }
  
  // Проверка уровня доступа
  if (currentUser && post.clearanceRequired) {
    const clearanceLevelMap = {
      [ClearanceLevel.LEVEL_1]: 1,
      [ClearanceLevel.LEVEL_2]: 2,
      [ClearanceLevel.LEVEL_3]: 3,
      [ClearanceLevel.LEVEL_4]: 4,
      [ClearanceLevel.LEVEL_5]: 5,
    };
    
    const userClearanceLevel = currentUser.clearanceLevel 
      ? clearanceLevelMap[currentUser.clearanceLevel] 
      : 1;
    
    const postClearanceLevel = clearanceLevelMap[post.clearanceRequired];
    
    if (userClearanceLevel < postClearanceLevel) {
      return { 
        success: false, 
        error: `Доступ запрещен. Требуется уровень доступа ${post.clearanceRequired}.` 
      };
    }
  } else if (post.clearanceRequired && post.clearanceRequired !== ClearanceLevel.LEVEL_1) {
    return { 
      success: false, 
      error: "Доступ запрещен. Требуется авторизация." 
    };
  }
  
  return { success: true, data: post };
};

// Создание публикации
export const createPost = async (postData: CreatePostData): Promise<ApiResponse<Post>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "У вас нет прав для создания публикаций" };
  }
  
  const posts = getLocalData<Post[]>(LOCAL_STORAGE_POSTS_KEY, []);
  
  // Создаем новую публикацию
  const newPost: Post = {
    id: `post-${Date.now()}`,
    ...postData,
    authorId: currentUser.id,
    authorName: currentUser.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedPosts = [...posts, newPost];
  saveLocalData(LOCAL_STORAGE_POSTS_KEY, updatedPosts);
  
  return { success: true, data: newPost, message: "Публикация успешно создана" };
};

// Обновление публикации
export const updatePost = async (id: string, updates: Partial<Post>): Promise<ApiResponse<Post>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
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

// Удаление публикации
export const deletePost = async (id: string): Promise<ApiResponse<null>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "У вас нет прав для удаления публикаций" };
  }
  
  const posts = getLocalData<Post[]>(LOCAL_STORAGE_POSTS_KEY, []);
  const updatedPosts = posts.filter(p => p.id !== id);
  
  saveLocalData(LOCAL_STORAGE_POSTS_KEY, updatedPosts);
  
  return { success: true, message: "Публикация успешно удалена" };
};

// Получение всех пользователей (только для администраторов)
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "У вас нет прав для просмотра пользователей" };
  }
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  return { success: true, data: users };
};

// Обновление роли пользователя (только для администраторов)
export const updateUserRole = async (id: string, role: string): Promise<ApiResponse<User>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
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
    role: role as UserRole
  };
  
  const updatedUsers = [
    ...users.slice(0, userIndex),
    updatedUser,
    ...users.slice(userIndex + 1)
  ];
  
  saveLocalData(LOCAL_STORAGE_USERS_KEY, updatedUsers);
  
  return { success: true, data: updatedUser, message: "Роль пользователя успешно обновлена" };
};

// Обновление уровня доступа пользователя (только для администраторов)
export const updateUserClearance = async (id: string, clearanceLevel: ClearanceLevel): Promise<ApiResponse<User>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "У вас нет прав для изменения уровней доступа" };
  }
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return { success: false, error: "Пользователь не найден" };
  }
  
  const updatedUser = {
    ...users[userIndex],
    clearanceLevel
  };
  
  const updatedUsers = [
    ...users.slice(0, userIndex),
    updatedUser,
    ...users.slice(userIndex + 1)
  ];
  
  saveLocalData(LOCAL_STORAGE_USERS_KEY, updatedUsers);
  
  // Если обновляется текущий пользователь, то обновляем и данные текущей сессии
  if (currentUser.id === id) {
    saveCurrentUser(updatedUser);
  }
  
  return { success: true, data: updatedUser, message: "Уровень доступа пользователя успешно обновлен" };
};

// Создание должности пользователя
export const updateUserPosition = async (
  id: string, 
  position: string, 
  department?: Department
): Promise<ApiResponse<User>> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Вы должны войти в систему" };
  }
  
  if (currentUser.role !== UserRole.ADMIN) {
    return { success: false, error: "У вас нет прав для изменения должностей" };
  }
  
  const users = getLocalData<User[]>(LOCAL_STORAGE_USERS_KEY, []);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return { success: false, error: "Пользователь не найден" };
  }
  
  const updatedUser = {
    ...users[userIndex],
    position,
    department: department || users[userIndex].department
  };
  
  const updatedUsers = [
    ...users.slice(0, userIndex),
    updatedUser,
    ...users.slice(userIndex + 1)
  ];
  
  saveLocalData(LOCAL_STORAGE_USERS_KEY, updatedUsers);
  
  // Если обновляется текущий пользователь, то обновляем и данные текущей сессии
  if (currentUser.id === id) {
    saveCurrentUser(updatedUser);
  }
  
  return { success: true, data: updatedUser, message: "Должность пользователя успешно обновлена" };
};

// Сброс всех данных в localStorage (только для тестирования)
export const resetDatabase = async (): Promise<ApiResponse<null>> => {
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  localStorage.removeItem(LOCAL_STORAGE_USERS_KEY);
  localStorage.removeItem(LOCAL_STORAGE_OBJECTS_KEY);
  localStorage.removeItem(LOCAL_STORAGE_POSTS_KEY);
  
  return { 
    success: true, 
    message: "База данных сброшена. Все пользователи, объекты и публикации удалены." 
  };
};
