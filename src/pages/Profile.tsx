import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/api";
import { UserRole } from "@/types";

// Helper function to get role label
const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "Администратор";
    case UserRole.RESEARCHER:
      return "Исследователь";
    case UserRole.SECURITY:
      return "Сотрудник Службы Безопасности";
    case UserRole.EXPLORER:
      return "Исследователь Аномалий";
    case UserRole.READER:
      return "Читатель";
    default:
      return role;
  }
};

// Helper function to get role description
const getRoleDescription = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "Полный доступ ко всем функциям и данным системы, включая создание и редактирование объектов SCE, публикаций, и управление пользователями.";
    case UserRole.RESEARCHER:
      return "Доступ к исследовательским данным и возможность создавать исследовательские отчеты.";
    case UserRole.SECURITY:
      return "Доступ к протоколам безопасности и процедурам содержания объектов.";
    case UserRole.EXPLORER:
      return "Доступ к полевым отчетам и данным о местах обнаружения аномалий.";
    case UserRole.READER:
      return "Базовый доступ к публичным данным и материалам Фонда SCE.";
    default:
      return "Неизвестная роль в системе.";
  }
};

// Helper function to get role color
const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-red-600 text-white";
    case UserRole.RESEARCHER:
      return "bg-blue-600 text-white";
    case UserRole.SECURITY:
      return "bg-yellow-600 text-white";
    case UserRole.EXPLORER:
      return "bg-green-600 text-white";
    case UserRole.READER:
      return "bg-gray-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Redirect to login if user is not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const roleLabel = getRoleLabel(user.role as UserRole);
  const roleDescription = getRoleDescription(user.role as UserRole);
  const roleColor = getRoleColor(user.role as UserRole);
  const registrationDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <Layout>
      <div className="sce-container py-12">
        <h1 className="text-3xl font-bold text-sce-primary mb-6">Профиль пользователя</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Информация о пользователе</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    {user.username}
                    <Badge className={roleColor}>{roleLabel}</Badge>
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Уровень доступа</h3>
                  <p>{roleDescription}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Дата регистрации</h3>
                  <p>{registrationDate}</p>
                </div>

                {user.role === "ADMIN" && (
                  <div className="pt-4">
                    <Button 
                      onClick={() => navigate("/admin")}
                      className="bg-sce-primary hover:bg-sce-hover"
                    >
                      Панель управления
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links Card */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые ссылки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/objects")}
                >
                  Объекты SCE
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/posts")}
                >
                  Публикации
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/logout")}
                >
                  Выйти из системы
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
