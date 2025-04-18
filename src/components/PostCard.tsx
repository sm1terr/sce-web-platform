import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post, PostCategory } from "@/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface PostCardProps {
  post: Post;
}

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

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const categoryLabel = getCategoryLabel(post.category as PostCategory);
  const categoryColor = getCategoryColor(post.category as PostCategory);
  const formattedDate = format(new Date(post.createdAt), "d MMMM yyyy", { locale: ru });

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <Badge className={categoryColor}>{categoryLabel}</Badge>
        </div>
        <div className="text-sm text-gray-500">
          {post.authorName} • {formattedDate}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-700 line-clamp-3">
          {post.content.substring(0, 150)}
          {post.content.length > 150 ? "..." : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/posts/${post.id}`} 
          className="text-sce-link hover:text-sce-hover text-sm font-medium"
        >
          Читать далее →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
