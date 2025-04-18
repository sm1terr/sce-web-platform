import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <Layout>
      <div className="sce-container py-12 md:py-24">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-4xl font-bold text-sce-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
          <p className="mb-8">
            Запрашиваемый ресурс не существует или был перемещен. 
            Возможно, вы не имеете достаточного уровня допуска для доступа к этому материалу.
          </p>
          <Button asChild>
            <Link to="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
