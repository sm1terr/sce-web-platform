import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logout, getCurrentUser } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const currentUser = getCurrentUser();
  
  // Если пользователь не авторизован, перенаправляем на главную
  useEffect(() => {
    if (!currentUser && !isLoggedOut) {
      navigate("/");
    }
  }, [currentUser, navigate, isLoggedOut]);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await logout();
      
      if (response.success) {
        setIsLoggedOut(true);
        toast({
          title: "Выход выполнен успешно",
          description: "Вы вышли из системы. До новых встреч!",
          variant: "default",
        });
        
        // Автоматический редирект на главную страницу через 2 секунды
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при выходе из системы",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  // Если пользователь не авторизован и не только что вышел, не показываем эту страницу
  if (!currentUser && !isLoggedOut) {
    return null;
  }
  
  return (
    <Layout>
      <div className="sce-container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-sce-background p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <LogOut className="h-8 w-8 text-sce-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-sce-primary">
              {isLoggedOut ? "Выход выполнен" : "Выход из системы"}
            </CardTitle>
            <CardDescription>
              {isLoggedOut 
                ? "Вы успешно вышли из своей учетной записи" 
                : "Вы действительно хотите выйти из системы?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {isLoggedOut ? (
              <p>
                Спасибо за использование информационной системы Фонда SCE. 
                Вы будете перенаправлены на главную страницу через несколько секунд.
              </p>
            ) : (
              <p>
                При выходе из системы вы потеряете доступ к защищенным материалам 
                и архивам, требующим авторизации.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            {isLoggedOut ? (
              <Button asChild variant="outline">
                <Link to="/">Вернуться на главную</Link>
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={isLoggingOut}
                >
                  Отмена
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Выход..." : "Выйти"}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Logout;
