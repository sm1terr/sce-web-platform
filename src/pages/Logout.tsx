import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { logout } from "@/lib/api";

const Logout = () => {
  const [message, setMessage] = useState("Выполняется выход из системы...");
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await logout();
        
        if (response.success) {
          setMessage("Выход выполнен успешно. Перенаправление...");
        } else {
          setMessage("Произошла ошибка при выходе. Перенаправление...");
        }
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        setMessage("Произошла ошибка при выходе. Перенаправление...");
        
        // Redirect even if there was an error
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p>{message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Logout;
