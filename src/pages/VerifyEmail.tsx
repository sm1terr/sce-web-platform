import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { verifyEmail } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const VerifyEmail = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await verifyEmail({ token });
      
      if (response.success) {
        toast({
          title: "Email подтвержден",
          description: "Ваш аккаунт активирован. Вы вошли в систему.",
          variant: "default",
        });
        navigate("/");
      } else {
        setError(response.error || "Произошла ошибка при подтверждении email");
      }
    } catch (error) {
      setError("Произошла ошибка при подключении к серверу");
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes, auto-fill a demo token
  React.useEffect(() => {
    setToken("demo-verification-token");
  }, []);

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-sce-primary">
                Подтверждение Email
              </CardTitle>
              <CardDescription className="text-center">
                Введите код подтверждения, отправленный на {email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token">Код подтверждения</Label>
                    <Input
                      id="token"
                      placeholder="Введите код"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Для демонстрации, код подтверждения заполнен автоматически. 
                      В реальном проекте код был бы отправлен на вашу почту.
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-sce-primary hover:bg-sce-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? "Проверка..." : "Подтвердить Email"}
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

export default VerifyEmail;
