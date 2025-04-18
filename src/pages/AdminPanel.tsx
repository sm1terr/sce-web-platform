import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUsers, getSCEObjects, getPosts, updateUserRole } from "@/lib/api";
import { User, SCEObject, Post, UserRole } from "@/types";
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

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [objects, setObjects] = useState<SCEObject[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Redirect to home if user is not admin
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

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all required data in parallel
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
        console.error("Error fetching admin data:", error);
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

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await updateUserRole(userId, newRole);
      
      if (response.success) {
        // Update the local state to reflect the change
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
      console.error("Error updating user role:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении роли пользователя",
        variant: "destructive",
      });
    }
  };

  // If user is not admin, don't render anything (redirect happens in useEffect)
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return null;
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: ru });
  };

  return (
    <Layout>
      <div className="sce-container py-12">
        <h1 className="text-3xl font-bold text-sce-primary mb-6">Панель управления</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="objects">Объекты SCE</TabsTrigger>
            <TabsTrigger value="posts">Публикации</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Пользователи</CardTitle>
                  <CardDescription>Всего зарегистрировано</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{users.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Объекты SCE</CardTitle>
                  <CardDescription>В базе данных</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{objects.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
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

          {/* Users Tab */}
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
                                disabled={user.id === currentUser.id} // Cannot change your own role
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

          {/* Objects Tab */}
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
                          <TableHead>Создан</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {objects.map((object) => (
                          <TableRow key={object.id}>
                            <TableCell className="font-medium">SCE-{object.number}</TableCell>
                            <TableCell>{object.title}</TableCell>
                            <TableCell>{object.objectClass}</TableCell>
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

          {/* Posts Tab */}
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
