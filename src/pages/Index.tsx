import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPosts, getSCEObjects, getCurrentUser } from "@/lib/api";
import { Post, SCEObject, ClearanceLevel } from "@/types";
import { Shield, FileText, AlertCircle, Lock } from "lucide-react";

const Index: React.FC = () => {
  const [latestObjects, setLatestObjects] = useState<SCEObject[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Получение данных параллельно
        const [objectsResponse, postsResponse] = await Promise.all([
          getSCEObjects(),
          getPosts()
        ]);
        
        if (objectsResponse.success && objectsResponse.data) {
          // Сортировка по дате создания (новые в начале) и ограничение до 3 элементов
          const sorted = [...objectsResponse.data]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
          setLatestObjects(sorted);
        }
        
        if (postsResponse.success && postsResponse.data) {
          // Сортировка по дате создания (новые в начале) и ограничение до 3 элементов
          const sorted = [...postsResponse.data]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
          setLatestPosts(sorted);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных на главной странице:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Получить цвет и название класса объекта
  const getObjectClassInfo = (objectClass: string) => {
    const classMap: Record<string, { color: string, name: string }> = {
      "SAFE": { color: "bg-sce-safe", name: "Безопасный" },
      "EUCLID": { color: "bg-sce-euclid", name: "Евклид" },
      "KETER": { color: "bg-sce-keter", name: "Кетер" },
      "THAUMIEL": { color: "bg-sce-thaumiel", name: "Таумиэль" },
      "NEUTRALIZED": { color: "bg-sce-neutralized", name: "Нейтрализованный" },
      "EXPLAINED": { color: "bg-sce-explained", name: "Объяснённый" }
    };
    
    return classMap[objectClass] || { color: "bg-gray-500", name: objectClass };
  };

  // Получить цвет и название категории поста
  const getPostCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { color: string, name: string }> = {
      "NEWS": { color: "bg-blue-600", name: "Новости" },
      "ARTICLE": { color: "bg-purple-600", name: "Статья" },
      "REPORT": { color: "bg-green-600", name: "Отчет" },
      "MEMO": { color: "bg-yellow-600", name: "Меморандум" },
      "BRIEFING": { color: "bg-red-600", name: "Брифинг" },
      "EVENT": { color: "bg-orange-600", name: "Событие" },
      "INTERVIEW": { color: "bg-indigo-600", name: "Интервью" }
    };
    
    return categoryMap[category] || { color: "bg-gray-600", name: category };
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Получение уровня допуска для отображения
  const getClearanceString = (level?: ClearanceLevel) => {
    if (!level) return "";
    
    const levelMap: Record<ClearanceLevel, string> = {
      [ClearanceLevel.LEVEL_1]: "Уровень 1",
      [ClearanceLevel.LEVEL_2]: "Уровень 2",
      [ClearanceLevel.LEVEL_3]: "Уровень 3",
      [ClearanceLevel.LEVEL_4]: "Уровень 4",
      [ClearanceLevel.LEVEL_5]: "Уровень 5"
    };
    
    return levelMap[level];
  };

  // Получение цвета бейджа уровня доступа
  const getClearanceColor = (level?: ClearanceLevel) => {
    if (!level) return "";
    
    const colorMap: Record<ClearanceLevel, string> = {
      [ClearanceLevel.LEVEL_1]: "sce-clearance-1",
      [ClearanceLevel.LEVEL_2]: "sce-clearance-2",
      [ClearanceLevel.LEVEL_3]: "sce-clearance-3",
      [ClearanceLevel.LEVEL_4]: "sce-clearance-4",
      [ClearanceLevel.LEVEL_5]: "sce-clearance-5"
    };
    
    return colorMap[level];
  };

  return (
    <Layout>
      {/* Герой-секция */}
      <div className="bg-sce-primary text-white py-16 md:py-24 border-b-8 border-sce-secondary">
        <div className="sce-container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-mono tracking-tight">
            SCE FOUNDATION
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Secure. Control. Explore. Мы защищаем человечество от аномальных угроз.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-sce-primary hover:bg-gray-200 font-bold"
            >
              <Link to="/objects">Исследовать объекты SCE</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-sce-primary"
            >
              <Link to="/about">О Фонде SCE</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Информационный блок */}
      <div className="bg-sce-background py-12">
        <div className="sce-container">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white p-8 border-2 border-sce-border rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-sce-primary mb-6 text-center">
                Наша миссия
              </h2>
              <div className="prose max-w-none">
                <p className="text-lg mb-4">
                  Фонд SCE — это секретная организация, занимающаяся сдерживанием, изучением и 
                  контролем аномальных объектов и явлений, представляющих угрозу для 
                  нормального течения реальности и безопасности человечества.
                </p>
                {!currentUser && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <strong>Внимание:</strong> Для получения доступа к полному архиву объектов SCE 
                          и служебным материалам необходимо <Link to="/login" className="font-medium underline">войти в систему</Link> или 
                          <Link to="/register" className="font-medium underline"> зарегистрироваться</Link>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-sce-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure</h3>
                  <p>Защита человечества от аномальных объектов и явлений</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-sce-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Control</h3>
                  <p>Сдерживание и контроль аномалий для обеспечения безопасности</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-sce-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Explore</h3>
                  <p>Изучение и исследование аномалий для развития науки</p>
                </div>
              </div>
            </div>
          </div>

          {/* Блок с последними объектами */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-sce-primary">Недавно добавленные объекты SCE</h2>
              <Button asChild variant="outline">
                <Link to="/objects">Просмотреть все объекты</Link>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-10">Загрузка последних объектов SCE...</div>
            ) : latestObjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestObjects.map((object) => {
                  const { color, name } = getObjectClassInfo(object.objectClass);
                  return (
                    <Card key={object.id} className="sce-card">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={`${color} text-white`}>
                            {name}
                          </Badge>
                          {object.requiredClearance && (
                            <Badge className={`sce-clearance-badge ${getClearanceColor(object.requiredClearance)}`}>
                              {getClearanceString(object.requiredClearance)}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="font-mono">
                          SCE-{object.number}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-xl font-bold mb-2">{object.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Добавлен: {formatDate(object.createdAt)}
                        </p>
                        <p className="line-clamp-3 text-sce-text">
                          {object.description.substring(0, 150)}...
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link to={`/objects/${object.id}`}>Подробнее</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="mb-4">В базе данных пока нет объектов SCE.</p>
                {currentUser?.role === "ADMIN" && (
                  <Button asChild>
                    <Link to="/admin/objects/create">Создать первый объект</Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Блок с последними публикациями */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-sce-primary">Последние публикации</h2>
              <Button asChild variant="outline">
                <Link to="/posts">Просмотреть все публикации</Link>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-10">Загрузка последних публикаций...</div>
            ) : latestPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestPosts.map((post) => {
                  const { color, name } = getPostCategoryInfo(post.category);
                  return (
                    <Card key={post.id} className="sce-card overflow-hidden flex flex-col h-full">
                      {post.featuredImage && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={post.featuredImage || "/placeholder.svg"} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={`${color} text-white`}>
                            {name}
                          </Badge>
                          {post.clearanceRequired && (
                            <Badge className={`sce-clearance-badge ${getClearanceColor(post.clearanceRequired)}`}>
                              {getClearanceString(post.clearanceRequired)}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2 mb-1">
                          {post.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">{post.authorName}</span> • {formatDate(post.createdAt)}
                        </p>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="line-clamp-3 text-sce-text">
                          {post.summary || post.content.substring(0, 150)}...
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link to={`/posts/${post.id}`}>Читать полностью</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="mb-4">В базе данных пока нет публикаций.</p>
                {currentUser?.role === "ADMIN" && (
                  <Button asChild>
                    <Link to="/admin/posts/create">Создать первую публикацию</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
