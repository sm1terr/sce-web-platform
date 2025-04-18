import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getPostById } from "@/lib/api";
import { Post, PostCategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft } from "lucide-react";

// Helper function to get category label
const getCategoryLabel = (category: PostCategory): string => {
  switch (category) {
    case PostCategory.NEWS:
      return "Новости";
    case PostCategory.ARTICLE:
      return "Статья";
    case PostCategory.REPORT:
      return "Отчет";
    case PostCategory.MEMO:
      return "Меморандум";
    default:
      return category;
  }
};

// Helper function to get category color
const getCategoryColor = (category: PostCategory): string => {
  switch (category) {
    case PostCategory.NEWS:
      return "bg-blue-600 hover:bg-blue-700";
    case PostCategory.ARTICLE:
      return "bg-green-600 hover:bg-green-700";
    case PostCategory.REPORT:
      return "bg-yellow-600 hover:bg-yellow-700";
    case PostCategory.MEMO:
      return "bg-purple-600 hover:bg-purple-700";
    default:
      return "bg-gray-600 hover:bg-gray-700";
  }
};

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("Идентификатор публикации не указан");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getPostById(id);
        
        if (response.success && response.data) {
          setPost(response.data);
        } else {
          setError("Публикация не найдена");
        }
      } catch (error) {
        setError("Произошла ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <p className="text-center">Загрузка публикации...</p>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <div className="max-w-3xl mx-auto">
            <Button asChild variant="outline" className="mb-6">
              <Link to="/posts"><ChevronLeft className="mr-2 h-4 w-4" /> Назад к списку публикаций</Link>
            </Button>
            <div className="bg-white border border-sce-border rounded-lg p-6">
              <p className="text-center text-red-600">{error || "Публикация не найдена"}</p>
              <p className="text-center mt-2">
                Запрашиваемая публикация не существует или у вас недостаточно прав для доступа к ней.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const categoryLabel = getCategoryLabel(post.category as PostCategory);
  const categoryColor = getCategoryColor(post.category as PostCategory);
  const formattedDate = format(new Date(post.createdAt), "d MMMM yyyy", { locale: ru });

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="max-w-3xl mx-auto">
          <Button asChild variant="outline" className="mb-6">
            <Link to="/posts"><ChevronLeft className="mr-2 h-4 w-4" /> Назад к списку публикаций</Link>
          </Button>

          <article className="bg-white border border-sce-border rounded-lg overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex justify-between items-start gap-4">
                <h1 className="text-3xl font-bold text-sce-primary">{post.title}</h1>
                <Badge className={categoryColor}>{categoryLabel}</Badge>
              </div>
              
              <div className="mb-6 text-sm text-gray-500">
                <span>Автор: {post.authorName}</span>
                <span className="mx-2">•</span>
                <span>Опубликовано: {formattedDate}</span>
              </div>
              
              <div className="prose max-w-none">
                {/* Split the content by paragraphs for better readability */}
                {post.content.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
