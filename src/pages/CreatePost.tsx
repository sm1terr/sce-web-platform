import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createPost, getCurrentUser } from "@/lib/api";
import { PostCategory, ClearanceLevel, UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Состояние формы
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>(PostCategory.NEWS);
  const [summary, setSummary] = useState("");
  const [clearanceRequired, setClearanceRequired] = useState<ClearanceLevel | "">("");
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Проверка прав доступа
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  if (currentUser.role !== UserRole.ADMIN) {
    navigate("/");
    toast({
      title: "Доступ запрещен",
      description: "У вас нет прав администратора для создания публикаций",
      variant: "destructive",
    });
    return null;
  }

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!title || !content || !category) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = tags.split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const postData = {
        title,
        content,
        category,
        summary: summary || undefined,
        clearanceRequired: clearanceRequired ? (clearanceRequired as ClearanceLevel) : undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        featuredImage: featuredImage || undefined,
      };

      const response = await createPost(postData);

      if (response.success && response.data) {
        toast({
          title: "Публикация создана",
          description: "Ваша публикация была успешно добавлена",
          variant: "default",
        });
        navigate(`/posts/${response.data.id}`);
      } else {
        setError(response.error || "Не удалось создать публикацию");
      }
    } catch (err) {
      console.error("Ошибка при создании публикации:", err);
      setError("Произошла ошибка при попытке создать публикацию");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-sce-primary mb-6">Создание новой публикации</h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Информация о публикации</CardTitle>
                <CardDescription>
                  Создайте новую публикацию для информационной базы Фонда SCE
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок *</Label>
                  <Input
                    id="title"
                    placeholder="Введите заголовок публикации"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория *</Label>
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value as PostCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PostCategory.NEWS}>Новости</SelectItem>
                      <SelectItem value={PostCategory.ARTICLE}>Статья</SelectItem>
                      <SelectItem value={PostCategory.REPORT}>Отчет</SelectItem>
                      <SelectItem value={PostCategory.MEMO}>Меморандум</SelectItem>
                      <SelectItem value={PostCategory.BRIEFING}>Брифинг</SelectItem>
                      <SelectItem value={PostCategory.EVENT}>Событие</SelectItem>
                      <SelectItem value={PostCategory.INTERVIEW}>Интервью</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Краткое описание</Label>
                  <Textarea
                    id="summary"
                    placeholder="Краткое описание или аннотация публикации (максимум 150-200 символов)"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="resize-none"
                    maxLength={200}
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {summary.length}/200
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Содержание *</Label>
                  <Textarea
                    id="content"
                    placeholder="Полный текст публикации..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="min-h-40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clearanceRequired">Требуемый уровень доступа</Label>
                  <Select 
                    value={clearanceRequired} 
                    onValueChange={(value) => setClearanceRequired(value as ClearanceLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Публичный доступ (не требуется)" />
                    </SelectTrigger>
                
                    <SelectContent>
                      <SelectItem value="">Публичный доступ (не требуется)</SelectItem>
                      <SelectItem value={ClearanceLevel.LEVEL_1}>Уровень 1</SelectItem>
                      <SelectItem value={ClearanceLevel.LEVEL_2}>Уровень 2</SelectItem>
                      <SelectItem value={ClearanceLevel.LEVEL_3}>Уровень 3</SelectItem>
                      <SelectItem value={ClearanceLevel.LEVEL_4}>Уровень 4</SelectItem>
                      <SelectItem value={ClearanceLevel.LEVEL_5}>Уровень 5</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Минимальный уровень доступа, необходимый для просмотра этой публикации
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Теги</Label>
                  <Input
                    id="tags"
                    placeholder="Введите теги через запятую (например: аномалия, исследование, отчет)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Ключевые слова для облегчения поиска и категоризации
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featuredImage">URL изображения</Label>
                  <Input
                    id="featuredImage"
                    placeholder="Введите URL изображения для публикации"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Ссылка на изображение, которое будет отображаться вместе с публикацией
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                  Отмена
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Создание..." : "Опубликовать"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
