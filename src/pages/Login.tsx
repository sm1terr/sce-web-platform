import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля формы");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await login({
        email,
        password
      });
      
      if (response.success) {
        toast({
          title: "Вход выполнен успешно",
          description: `Добро пожаловать, ${response.data?.username}!`,
          variant: "default",
        });
        navigate("/");
      } else {
        setError(response.error || "Произошла ошибка при входе");
        // Для демонстрационных целей показываем подсказку о пароле
        if (response.error?.includes("Неверный пароль")) {
          setError("Неверный пароль. Для демонстрации используйте пароль 'password'");
        }
      }
    } catch (err) {
      setError("Произошла ошибка при обработке запроса");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="sce-container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-sce-primary text-center">Вход в систему</CardTitle>
            <CardDescription className="text-center">
              Войдите в вашу учетную запись Фонда SCE
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant={error.includes('демонстрации') ? "default" : "destructive"} className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Введите ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Пароль</Label>
                  <Link to="/reset-password" className="text-xs text-sce-link">
                    Забыли пароль?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите ваш пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Выполняется вход..." : "Войти"}
              </Button>
            </form>
            
            {/* Подсказка для демонстрационного режима */}
            <div className="mt-6 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Для демонстрации:</strong> Используйте любой email из зарегистрированных аккаунтов и пароль "password".
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Ещё нет аккаунта?{" "}
              <Link to="/register" className="text-sce-link font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
