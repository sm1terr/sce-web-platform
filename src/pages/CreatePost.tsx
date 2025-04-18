import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { createPost } from "@/lib/api";
import { PostCategory } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>(PostCategory.NEWS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createPost({
        title,
        content,
        category
      });

      if (response.success && response.data) {
        toast({
          title: "Публикация создана",
          description: "Публикация успешно добавлена",
          variant: "default",
        });
        navigate(`/posts/${response.data.id}`);
      } else {
        toast({
          title: "Ошибка",
          description: response.error || "Не удалось создать публикацию",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании публикации",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-sce-primary">Создать новую публикацию</h1>
            <Button asChild variant="outline">
              <Link to="/admin"><ChevronLeft className="mr-2 h-4 w-4" /> Назад к панели управления</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Информация о публикации</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value as PostCategory)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PostCategory.NEWS}>Новости</SelectItem>
                      <SelectItem value={PostCategory.ARTICLE}>Статья</SelectItem>
                      <SelectItem value={PostCategory.REPORT}>Отчет</SelectItem>
                      <SelectItem value={PostCategory.MEMO}>Меморандум</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    placeholder="Введите заголовок публикации"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Содержание</Label>
                  <Textarea
                    id="content"
                    placeholder="Введите текст публикации..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Для разделения на параграфы используйте двойной перенос строки.
                  </p>
                </div>

                <div className="pt-4 flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin")}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    className="bg-sce-primary hover:bg-sce-hover"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Создание..." : "Опубликовать"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
