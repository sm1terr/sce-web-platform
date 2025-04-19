import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Shield } from "lucide-react";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo-token";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  
  const handleVerify = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      const response = await verifyEmail({ token });
      
      if (response.success) {
        setIsVerified(true);
        toast({
          title: "Email подтвержден",
          description: "Ваш email успешно подтвержден. Теперь вы можете пользоваться всеми функциями сайта.",
          variant: "default",
        });
        
        // Автоматический редирект на главную страницу через 3 секунды
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError(response.error || "Произошла ошибка при подтверждении email");
      }
    } catch (err) {
      setError("Произошла ошибка при обработке запроса");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Автоматическая проверка токена при загрузке страницы, если есть токен в URL
  useEffect(() => {
    if (token && token !== "demo-token") {
      handleVerify();
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <Layout>
      <div className="sce-container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-sce-primary text-center">
              Подтверждение Email
            </CardTitle>
            <CardDescription className="text-center">
              {isVerified 
                ? "Ваш email был успешно подтвержден" 
                : "Подтвердите ваш email для завершения регистрации"}
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
            
            {isVerified ? (
              <div className="text-center py-4 space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-sce-primary">Подтверждение успешно!</h3>
                <p>
                  Ваш email успешно подтвержден. Теперь вы можете пользоваться всеми функциями сайта.
                </p>
                <p className="text-sm text-muted-foreground">
                  Вы будете автоматически перенаправлены на главную страницу через несколько секунд...
                </p>
              </div>
            ) : (
              <div className="text-center py-4 space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-sce-background p-3">
                    <Shield className="h-10 w-10 text-sce-primary" />
                  </div>
                </div>
                <div>
                  <p className="mb-4">
                    Пожалуйста, подтвердите ваш email, нажав на кнопку ниже. Это действие необходимо 
                    для обеспечения безопасности и предоставления вам полного доступа к архивам 
                    Фонда SCE.
                  </p>
                  
                  <Alert className="mt-6 bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Демонстрационный режим</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Для целей демонстрации, нажатие на кнопку "Подтвердить Email" подтвердит 
                      последний зарегистрированный аккаунт без фактической проверки email.
                    </AlertDescription>
                  </Alert>
                </div>
                
                <Button 
                  onClick={handleVerify} 
                  disabled={isSubmitting} 
                  className="w-full"
                >
                  {isSubmitting ? "Подтверждение..." : "Подтвердить Email"}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {isVerified ? (
              <Button asChild variant="outline">
                <Link to="/">Перейти на главную</Link>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Вернуться на{" "}
                <Link to="/login" className="text-sce-link font-medium">
                  страницу входа
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
