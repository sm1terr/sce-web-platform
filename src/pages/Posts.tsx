import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getPosts } from "@/lib/api";
import { Post, PostCategory, ClearanceLevel } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertCircleIcon, FileTextIcon, NewspaperIcon, FileIcon, MessagesSquareIcon } from "lucide-react";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Загрузка данных
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPosts();
        
        if (response.success && response.data) {
          setPosts(response.data);
          setFilteredPosts(response.data);
        } else {
          setError(response.error || "Не удалось загрузить публикации");
        }
      } catch (err) {
        setError("Произошла ошибка при загрузке публикаций");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Фильтрация постов при изменении активной вкладки
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === activeTab));
    }
  }, [activeTab, posts]);

  // Получить иконку для категории поста
  const getCategoryIcon = (category: PostCategory) => {
    switch (category) {
      case PostCategory.NEWS:
        return <NewspaperIcon size={16} className="mr-1" />;
      case PostCategory.ARTICLE:
        return <FileTextIcon size={16} className="mr-1" />;
      case PostCategory.REPORT:
        return <FileIcon size={16} className="mr-1" />;
      case PostCategory.MEMO:
        return <MessagesSquareIcon size={16} className="mr-1" />;
      case PostCategory.BRIEFING:
        return <AlertCircleIcon size={16} className="mr-1" />;
      default:
        return <InfoIcon size={16} className="mr-1" />;
    }
  };

  // Получить локализованное название категории
  const getCategoryName = (category: PostCategory) => {
    const categoryNames = {
      [PostCategory.NEWS]: "Новости",
      [PostCategory.ARTICLE]: "Статья",
      [PostCategory.REPORT]: "Отчет",
      [PostCategory.MEMO]: "Меморандум",
      [PostCategory.BRIEFING]: "Брифинг",
      [PostCategory.EVENT]: "Событие",
      [PostCategory.INTERVIEW]: "Интервью"
    };
    
    return categoryNames[category] || category;
  };

  // Получить цвет бейджа уровня доступа
  const getClearanceColor = (level: ClearanceLevel | undefined) => {
    if (!level) return "bg-gray-500";
    
    const clearanceColors = {
      [ClearanceLevel.LEVEL_1]: "bg-green-600",
      [ClearanceLevel.LEVEL_2]: "bg-blue-600",
      [ClearanceLevel.LEVEL_3]: "bg-orange-600",
      [ClearanceLevel.LEVEL_4]: "bg-red-600",
      [ClearanceLevel.LEVEL_5]: "bg-black"
    };
    
    return clearanceColors[level];
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Генерация описания из контента (первые 150 символов)
  const getPostSummary = (post: Post) => {
    if (post.summary) return post.summary;
    
    const maxLength = 150;
    return post.content.length > maxLength 
      ? `${post.content.substring(0, maxLength)}...` 
      : post.content;
  };

  if (loading) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <h1 className="text-3xl font-bold text-sce-primary mb-6 text-center">Публикации Фонда SCE</h1>
          <div className="text-center py-10">Загрузка публикаций...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <h1 className="text-3xl font-bold text-sce-primary mb-6 text-center">Публикации Фонда SCE</h1>
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sce-primary mb-3">Публикации Фонда SCE</h1>
          <p className="text-sce-secondary max-w-2xl mx-auto">
            Официальные публикации, отчеты, новости и другие материалы, касающиеся деятельности Фонда SCE и содержания объектов под нашим контролем.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value={PostCategory.NEWS}>Новости</TabsTrigger>
              <TabsTrigger value={PostCategory.ARTICLE}>Статьи</TabsTrigger>
              <TabsTrigger value={PostCategory.REPORT}>Отчеты</TabsTrigger>
              <TabsTrigger value={PostCategory.MEMO}>Меморандумы</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sce-secondary text-lg">Публикации данной категории не найдены.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
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
                        <Badge className="flex items-center" variant="outline">
                          {getCategoryIcon(post.category)}
                          {getCategoryName(post.category)}
                        </Badge>
                        {post.clearanceRequired && (
                          <Badge className={`${getClearanceColor(post.clearanceRequired)} text-white`}>
                            Уровень {post.clearanceRequired.replace('LEVEL_', '')}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="sce-card-title line-clamp-2 border-b-0 mb-0 pb-0">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 flex-grow">
                      <p className="text-sm text-muted-foreground mb-4">
                        <span className="font-medium">{post.authorName}</span> • {formatDate(post.createdAt)}
                      </p>
                      <p className="line-clamp-3 text-sce-text">
                        {getPostSummary(post)}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-4">
                      <Button asChild className="w-full">
                        <Link to={`/posts/${post.id}`}>Читать полностью</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Posts;
