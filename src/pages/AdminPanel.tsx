import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUsers, getSCEObjects, getPosts, updateUserRole, updateUserClearance, updateUserPosition } from "@/lib/api";
import { User, SCEObject, Post, UserRole, ClearanceLevel, Department } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [objects, setObjects] = useState<SCEObject[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Перенаправление на главную, если пользователь не администратор
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== UserRole.ADMIN) {
      navigate("/");
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав администратора для доступа к этой странице",
        variant: "destructive",
      });
    }
  }, [currentUser, navigate, toast]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Получаем все необходимые данные параллельно
        const [usersResponse, objectsResponse, postsResponse] = await Promise.all([
          getUsers(),
          getSCEObjects(),
          getPosts()
        ]);
        
        if (usersResponse.success && usersResponse.data) {
          setUsers(usersResponse.data);
        }
        
        if (objectsResponse.success && objectsResponse.data) {
          setObjects(objectsResponse.data);
        }
        
        if (postsResponse.success && postsResponse.data) {
          setPosts(postsResponse.data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных администратора:", error);
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить данные для панели управления",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.role === UserRole.ADMIN) {
      fetchData();
    }
  }, [currentUser, toast]);

  // Обработка изменения роли пользователя
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await updateUserRole(userId, newRole);
      
      if (response.success) {
        // Обновляем локальное состояние, чтобы отразить изменение
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, role: newRole as UserRole } : user
          )
        );
        
        toast({
          title: "Роль обновлена",
          description: "Роль пользователя была успешно обновлена",
          variant: "default",
        });
      } else {
        toast({
          title: "Ошибка обновления",
          description: response.error || "Не удалось обновить роль пользователя",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при обновлении роли пользователя:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении роли пользователя",
        variant: "destructive",
      });
    }
  };

  // Обработка изменения уровня доступа пользователя
  const handleClearanceChange = async (userId: string, newClearance: string) => {
    try {
      const response = await updateUserClearance(userId, newClearance as ClearanceLevel);
      
      if (response.success) {
        // Обновляем локальное состояние, чтобы отразить изменение
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, clearanceLevel: newClearance as ClearanceLevel } : user
          )
        );
        
        toast({
          title: "Уровень доступа обновлен",
          description: "Уровень доступа пользователя был успешно обновлен",
          variant: "default",
        });
      } else {
        toast({
          title: "Ошибка обновления",
          description: response.error || "Не удалось обновить уровень доступа пользователя",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при обновлении уровня доступа пользователя:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении уровня доступа пользователя",
        variant: "destructive",
      });
    }
  };

  // Обработка изменения должности пользователя
  const handlePositionChange = async (userId: string, newPosition: string, department?: Department) => {
    try {
      const response = await updateUserPosition(userId, newPosition, department);
      
      if (response.success) {
        // Обновляем локальное состояние, чтобы отразить изменение
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, position: newPosition, department } : user
          )
        );
        
        toast({
          title: "Должность обновлена",
          description: "Должность пользователя была успешно обновлена",
          variant: "default",
        });
      } else {
        toast({
          title: "Ошибка обновления",
          description: response.error || "Не удалось обновить должность пользователя",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при обновлении должности пользователя:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении должности пользователя",
        variant: "destructive",
      });
    }
  };

  // Если пользователь не является администратором, не рендерим ничего
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return null;
  }

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: ru });
  };

  // Получение цвета для класса объекта
  const getObjectClassColor = (objectClass: string) => {
    const classColors = {
      "SAFE": "bg-sce-safe",
      "EUCLID": "bg-sce-euclid",
      "KETER": "bg-sce-keter",
      "THAUMIEL": "bg-sce-thaumiel",
      "NEUTRALIZED": "bg-sce-neutralized",
      "EXPLAINED": "bg-sce-explained"
    };
    
    return classColors[objectClass as keyof typeof classColors] || "bg-gray-500";
  };

  // Получение локализованного названия класса объекта
  const getObjectClassName = (objectClass: string) => {
    const classNames = {
      "SAFE": "Безопасный",
      "EUCLID": "Евклид",
      "KETER": "Кетер",
      "THAUMIEL": "Таумиэль",
      "NEUTRALIZED": "Нейтрализованный",
      "EXPLAINED": "Объяснённый"
    };
    
    return classNames[objectClass as keyof typeof classNames] || objectClass;
  };

  return (
    <Layout>
      <div className="sce-container py-12">
        <h1 className="text-4xl font-bold text-sce-primary mb-8">Панель управления Фонда SCE</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 mb-8 w-full max-w-3xl mx-auto">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="objects">Объекты SCE</TabsTrigger>
            <TabsTrigger value="posts">Публикации</TabsTrigger>
          </TabsList>

          {/* Вкладка обзора */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Пользователи</CardTitle>
                  <CardDescription>Всего зарегистрировано</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{users.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Объекты SCE</CardTitle>
                  <CardDescription>В базе данных</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{objects.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Публикации</CardTitle>
                  <CardDescription>Всего материалов</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{posts.length}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление объектами</CardTitle>
                  <CardDescription>Создание и редактирование объектов SCE</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button asChild className="w-full">
                      <Link to="/admin/objects/create">Создать новый объект SCE</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/objects">Просмотреть все объекты</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Управление публикациями</CardTitle>
                  <CardDescription>Создание и редактирование публикаций</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button asChild className="w-full">
                      <Link to="/admin/posts/create">Создать новую публикацию</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/posts">Просмотреть все материалы</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Вкладка пользователей */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>
                  Просмотр и управление учетными записями пользователей
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-4">Загрузка данных пользователей...</p>
                ) : users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Имя пользователя</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Роль</TableHead>
                          <TableHead>Уровень доступа</TableHead>
                          <TableHead>Должность</TableHead>
                          <TableHead>Дата регистрации</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.isEmailVerified ? (
                                <span className="text-green-600">Подтвержден</span>
                              ) : (
                                <span className="text-yellow-600">Не подтвержден</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={user.role}
                                onValueChange={(value) => handleRoleChange(user.id, value)}
                                disabled={user.id === currentUser.id} // Нельзя изменить свою собственную роль
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Выберите роль" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={UserRole.ADMIN}>Администратор</SelectItem>
                                  <SelectItem value={UserRole.RESEARCHER}>Исследователь</SelectItem>
                                  <SelectItem value={UserRole.SECURITY}>Сотрудник СБ</SelectItem>
                                  <SelectItem value={UserRole.EXPLORER}>Исследователь Аномалий</SelectItem>
                                  <SelectItem value={UserRole.READER}>Читатель</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={user.clearanceLevel || ClearanceLevel.LEVEL_1}
                                onValueChange={(value) => handleClearanceChange(user.id, value)}
                                disabled={user.id === currentUser.id} // Нельзя изменить свой собственный уровень доступа
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Выберите уровень" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={ClearanceLevel.LEVEL_1}>Уровень 1</SelectItem>
                                  <SelectItem value={ClearanceLevel.LEVEL_2}>Уровень 2</SelectItem>
                                  <SelectItem value={ClearanceLevel.LEVEL_3}>Уровень 3</SelectItem>
                                  <SelectItem value={ClearanceLevel.LEVEL_4}>Уровень 4</SelectItem>
                                  <SelectItem value={ClearanceLevel.LEVEL_5}>Уровень 5</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                value={user.position || ""}
                                onChange={(e) => handlePositionChange(user.id, e.target.value, user.department)}
                                className="w-full p-2 border border-sce-border rounded focus:border-sce-primary 
                                          focus:ring-1 focus:ring-sce-primary transition-all"
                                placeholder="Должность"
                              />
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center py-4">Нет зарегистрированных пользователей</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка объектов */}
          <TabsContent value="objects">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Объекты SCE</h2>
              <Button asChild>
                <Link to="/admin/objects/create">Создать новый объект</Link>
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                {isLoading ? (
                  <p className="text-center py-4">Загрузка объектов SCE...</p>
                ) : objects.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Номер</TableHead>
                          <TableHead>Название</TableHead>
                          <TableHead>Класс</TableHead>
                          <TableHead>Уровень доступа</TableHead>
                          <TableHead>Создан</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {objects.map((object) => (
                          <TableRow key={object.id}>
                            <TableCell className="font-medium font-mono">SCE-{object.number}</TableCell>
                            <TableCell>{object.title}</TableCell>
                            <TableCell>
                              <Badge 
                                className={`${getObjectClassColor(object.objectClass)} text-white`}
                              >
                                {getObjectClassName(object.objectClass)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {object.requiredClearance ? (
                                <Badge 
                                  className={`sce-clearance-badge sce-clearance-${object.requiredClearance.replace('LEVEL_', '')}`}
                                >
                                  {object.requiredClearance.replace('LEVEL_', 'Уровень ')}
                                </Badge>
                              ) : (
                                <Badge className="sce-clearance-badge sce-clearance-1">
                                  Уровень 1
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(object.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/objects/${object.id}`}>Просмотр</Link>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/admin/objects/edit/${object.id}`}>Изменить</Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>Нет объектов SCE в базе данных</p>
                    <Button asChild className="mt-4">
                      <Link to="/admin/objects/create">Создать первый объект</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка публикаций */}
          <TabsContent value="posts">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Публикации</h2>
              <Button asChild>
                <Link to="/admin/posts/create">Создать новую публикацию</Link>
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                {isLoading ? (
                  <p className="text-center py-4">Загрузка публикаций...</p>
                ) : posts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Заголовок</TableHead>
                          <TableHead>Категория</TableHead>
                          <TableHead>Автор</TableHead>
                          <TableHead>Уровень доступа</TableHead>
                          <TableHead>Дата публикации</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>{post.category}</TableCell>
                            <TableCell>{post.authorName}</TableCell>
                            <TableCell>
                              {post.clearanceRequired ? (
                                <Badge 
                                  className={`sce-clearance-badge sce-clearance-${post.clearanceRequired.replace('LEVEL_', '')}`}
                                >
                                  {post.clearanceRequired.replace('LEVEL_', 'Уровень ')}
                                </Badge>
                              ) : (
                                <Badge className="sce-clearance-badge sce-clearance-1">
                                  Уровень 1
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(post.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/posts/${post.id}`}>Просмотр</Link>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/admin/posts/edit/${post.id}`}>Изменить</Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>Нет публикаций в базе данных</p>
                    <Button asChild className="mt-4">
                      <Link to="/admin/posts/create">Создать первую публикацию</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
