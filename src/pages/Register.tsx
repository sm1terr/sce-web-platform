import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username || !email || !password || !confirmPassword) {
      setError("Пожалуйста, заполните все поля формы");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await register({
        username,
        email,
        password,
        confirmPassword
      });
      
      if (response.success) {
        toast({
          title: "Регистрация прошла успешно",
          description: "Пожалуйста, подтвердите ваш email для завершения регистрации.",
          variant: "default",
        });
        setIsRegistered(true);
      } else {
        setError(response.error || "Произошла ошибка при регистрации");
      }
    } catch (err) {
      setError("Произошла ошибка при обработке запроса");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Если регистрация успешна, показываем информацию о необходимости подтверждения email
  if (isRegistered) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-sce-primary">Регистрация успешна</CardTitle>
              <CardDescription>Один шаг до получения доступа</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>Пожалуйста, проверьте ваш email <strong>{email}</strong> для подтверждения учетной записи.</p>
              <p className="text-muted-foreground text-sm">
                После подтверждения вы сможете получить доступ к архивам и материалам Фонда SCE.
              </p>
              <Alert className="mt-6 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Важное примечание</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  В целях демонстрации, для подтверждения учетной записи перейдите на страницу 
                  <Link to="/verify-email" className="font-medium text-sce-primary"> подтверждения email</Link>.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild variant="outline">
                <Link to="/">Вернуться на главную</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="sce-container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-sce-primary text-center">Регистрация в системе</CardTitle>
            <CardDescription className="text-center">
              Создайте учетную запись для доступа к архивам Фонда SCE
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Введите ваше имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              
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
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Создайте пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-sce-link font-medium">
                Войти
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
