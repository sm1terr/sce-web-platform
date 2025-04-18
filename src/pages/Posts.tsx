import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getPosts } from "@/lib/api";
import { Post, PostCategory } from "@/types";
import PostCard from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await getPosts();
        
        if (response.success && response.data) {
          setPosts(response.data);
          setFilteredPosts(response.data);
        } else {
          setError("Не удалось загрузить публикации");
        }
      } catch (error) {
        setError("Произошла ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Apply filters when search query or category filter changes
  useEffect(() => {
    let result = [...posts];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.authorName.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "ALL") {
      result = result.filter((post) => post.category === categoryFilter);
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredPosts(result);
  }, [searchQuery, categoryFilter, posts]);

  return (
    <Layout>
      <div className="sce-container py-12">
        <h1 className="text-3xl font-bold text-sce-primary mb-6">Публикации</h1>
        
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search" className="mb-2 block">Поиск</Label>
            <Input
              id="search"
              placeholder="Поиск по заголовку, содержанию или автору..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="category-filter" className="mb-2 block">Категория</Label>
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger id="category-filter" className="w-full">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Все категории</SelectItem>
                <SelectItem value={PostCategory.NEWS}>Новости</SelectItem>
                <SelectItem value={PostCategory.ARTICLE}>Статьи</SelectItem>
                <SelectItem value={PostCategory.REPORT}>Отчеты</SelectItem>
                <SelectItem value={PostCategory.MEMO}>Меморандумы</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p>Загрузка публикаций...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-gray-200 rounded-md">
            <p className="text-lg">Публикации не найдены</p>
            {searchQuery || categoryFilter !== "ALL" ? (
              <p className="text-sm text-gray-500 mt-2">
                Попробуйте изменить параметры поиска
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                В базе данных пока нет публикаций
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Posts;
