import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="sce-container py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-sce-background rounded-full">
              <FileWarning className="h-16 w-16 text-sce-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-sce-primary mb-4">
            Доступ запрещен
          </h1>
          
          <div className="font-mono text-2xl mb-8 p-4 bg-sce-background border border-sce-border rounded-md">
            <div className="text-sce-primary mb-2">ОШИБКА 404</div>
            <div className="text-sm text-sce-secondary">
              <span className="font-bold">СБ-1774:</span> Запрашиваемый документ не существует или доступ к нему ограничен
            </div>
          </div>
          
          <div className="mb-8 space-y-4">
            <p className="text-lg">
              Запрашиваемый вами файл или страница не существует в базе данных Фонда SCE.
            </p>
            <p className="text-sce-secondary">
              Возможные причины:
            </p>
            <ul className="list-disc text-left pl-8 text-sce-secondary">
              <li>Документ был перемещен или удален</li>
              <li>Неверный URL или опечатка в адресе</li>
              <li>Недостаточный уровень допуска</li>
              <li>Документ засекречен или находится на карантине</li>
            </ul>
          </div>
          
          <div className="p-4 border-t border-sce-border mb-8">
            <p className="text-sm text-sce-secondary mb-2">
              Данное действие было зарегистрировано в системе безопасности Фонда SCE.
            </p>
            <p className="text-xs text-sce-secondary">
              Многократные попытки получить доступ к несуществующим или ограниченным документам 
              могут привести к временной блокировке учетной записи.
            </p>
          </div>
          
          <div className="space-x-4">
            <Button asChild>
              <Link to="/">Вернуться на главную</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/objects">Просмотреть доступные объекты</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
