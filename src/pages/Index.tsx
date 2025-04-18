import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSCEObjects, getPosts } from "@/lib/api";
import { Post, SCEObject } from "@/types";
import ObjectCard from "@/components/ObjectCard";
import PostCard from "@/components/PostCard";

const Index = () => {
  const [recentObjects, setRecentObjects] = useState<SCEObject[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [objectsResponse, postsResponse] = await Promise.all([
          getSCEObjects(),
          getPosts()
        ]);

        if (objectsResponse.success && objectsResponse.data) {
          setRecentObjects(
            objectsResponse.data
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3)
          );
        }

        if (postsResponse.success && postsResponse.data) {
          setRecentPosts(
            postsResponse.data
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3)
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-sce-primary text-white py-12 md:py-24">
        <div className="sce-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">SCE Foundation</h1>
            <p className="text-xl md:text-2xl mb-8">Secure. Control. Explore.</p>
            <p className="text-lg mb-8">
              Фонд SCE занимается задержанием, исследованием и контролем аномалий для защиты человечества.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-sce-primary hover:bg-gray-200">
                <Link to="/objects">Изучить объекты SCE</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <Link to="/about">О Фонде SCE</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 bg-white">
        <div className="sce-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-sce-primary">Наша Миссия</h2>
            <p className="text-lg mb-6">
              Фонд SCE стремится обнаруживать и содержать аномальные объекты, сущности и явления,
              чтобы защитить человечество от их вредоносных эффектов, 
              а также изучать их для понимания и использования их свойств.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-center text-sce-primary">Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    Обнаружение и надежное задержание аномальных объектов для обеспечения безопасности человечества.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-center text-sce-primary">Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    Контроль и управление аномалиями через строгие процедуры и протоколы содержания.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-center text-sce-primary">Explore</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    Изучение и исследование аномалий для расширения человеческих знаний и потенциального применения.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Recent SCE Objects */}
      <section className="py-12 bg-gray-50">
        <div className="sce-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-sce-primary">Последние объекты SCE</h2>
            <Button asChild variant="outline" className="text-sce-primary border-sce-primary hover:bg-sce-primary hover:text-white">
              <Link to="/objects">Все объекты</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Загрузка объектов...</div>
          ) : recentObjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentObjects.map((object) => (
                <ObjectCard key={object.id} object={object} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p>Пока нет доступных объектов SCE.</p>
                <p className="mt-2 text-sm text-gray-500">
                  Администратор может добавить новые объекты через панель управления.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-12 bg-white">
        <div className="sce-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-sce-primary">Последние публикации</h2>
            <Button asChild variant="outline" className="text-sce-primary border-sce-primary hover:bg-sce-primary hover:text-white">
              <Link to="/posts">Все публикации</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Загрузка публикаций...</div>
          ) : recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p>Пока нет доступных публикаций.</p>
                <p className="mt-2 text-sm text-gray-500">
                  Администратор может добавить новые публикации через панель управления.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Join SCE */}
      <section className="py-12 bg-sce-primary text-white">
        <div className="sce-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Присоединяйтесь к Фонду SCE</h2>
            <p className="text-lg mb-8">
              Станьте частью нашей миссии по защите человечества и исследованию аномалий.
              Зарегистрируйтесь, чтобы получить доступ к секретным материалам.
            </p>
            <Button asChild size="lg" className="bg-white text-sce-primary hover:bg-gray-200">
              <Link to="/register">Зарегистрироваться</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
