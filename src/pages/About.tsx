import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Lock, 
  Microscope, 
  FileSearch, 
  User,
  Users,
  BookOpen,
  Globe
} from "lucide-react";

const About: React.FC = () => {
  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sce-primary mb-4">О Фонде SCE</h1>
          <p className="text-xl text-sce-secondary max-w-3xl mx-auto">
            Secure. Control. Explore. — Защита человечества через изучение аномалий.
          </p>
        </div>

        {/* Основная информация о Фонде */}
        <div className="max-w-4xl mx-auto mb-16 bg-white p-8 border-2 border-sce-border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-sce-primary mb-6 pb-3 border-b-2 border-sce-border">
            Наша миссия
          </h2>
          <p className="mb-6 text-lg">
            Фонд SCE — это секретная международная организация, занимающаяся сдерживанием, 
            изучением и контролем аномальных объектов, существ и явлений, которые представляют 
            угрозу для нормального течения естественной реальности и безопасности человечества в целом.
          </p>
          <p className="mb-6 text-lg">
            Основные принципы нашей работы зашифрованы в аббревиатуре SCE:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-sce-backgroundAlt p-6 rounded-lg border border-sce-border">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-sce-primary" />
              </div>
              <h3 className="font-bold text-xl text-center mb-2">Secure</h3>
              <p className="text-center">
                Обеспечение безопасности человечества путём изоляции аномальных объектов
              </p>
            </div>
            <div className="bg-sce-backgroundAlt p-6 rounded-lg border border-sce-border">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-sce-primary" />
              </div>
              <h3 className="font-bold text-xl text-center mb-2">Control</h3>
              <p className="text-center">
                Контроль над аномальными явлениями для предотвращения их влияния
              </p>
            </div>
            <div className="bg-sce-backgroundAlt p-6 rounded-lg border border-sce-border">
              <div className="flex justify-center mb-4">
                <Microscope className="h-12 w-12 text-sce-primary" />
              </div>
              <h3 className="font-bold text-xl text-center mb-2">Explore</h3>
              <p className="text-center">
                Исследование аномалий для понимания их сущности и потенциальной пользы
              </p>
            </div>
          </div>
          <div className="p-4 bg-sce-background rounded-lg border border-sce-border mb-6">
            <p className="italic text-sce-secondary">
              "Знание — наше главное оружие в борьбе с неизвестным. Наша задача — защитить границы 
              реальности, сдерживая опасные аномалии и изучая безопасные для всеобщего блага."
            </p>
            <p className="text-right mt-2 font-medium">— Д-р Александр Васнецов, основатель Фонда SCE</p>
          </div>
        </div>

        {/* Структура организации */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-sce-primary mb-6 pb-3 border-b-2 border-sce-border">
            Структура организации
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 border-2 border-sce-border rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-sce-primary mr-3" />
                <h3 className="font-bold text-xl">Департаменты</h3>
              </div>
              <ul className="space-y-3 list-disc pl-6">
                <li>
                  <span className="font-medium">Департамент исследований</span> — изучение аномальных объектов
                </li>
                <li>
                  <span className="font-medium">Департамент содержания</span> — обеспечение изоляции объектов
                </li>
                <li>
                  <span className="font-medium">Департамент безопасности</span> — защита персонала и объектов
                </li>
                <li>
                  <span className="font-medium">Департамент административных дел</span> — управление ресурсами
                </li>
                <li>
                  <span className="font-medium">Оперативный департамент</span> — полевые операции и обнаружение
                </li>
                <li>
                  <span className="font-medium">Этический комитет</span> — контроль за соблюдением этики
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 border-2 border-sce-border rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-sce-primary mr-3" />
                <h3 className="font-bold text-xl">Персонал</h3>
              </div>
              <ul className="space-y-3 list-disc pl-6">
                <li>
                  <span className="font-medium">Исследователи</span> — учёные, занимающиеся изучением аномалий
                </li>
                <li>
                  <span className="font-medium">Сотрудники СБ</span> — обеспечивают защиту и контроль
                </li>
                <li>
                  <span className="font-medium">Исследователи аномалий</span> — полевые специалисты
                </li>
                <li>
                  <span className="font-medium">Технический персонал</span> — поддержка и обслуживание
                </li>
                <li>
                  <span className="font-medium">Административный персонал</span> — управление и логистика
                </li>
                <li>
                  <span className="font-medium">Класс D</span> — персонал для непосредственного взаимодействия с опасными объектами
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Классификация объектов */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-sce-primary mb-6 pb-3 border-b-2 border-sce-border">
            Классификация объектов SCE
          </h2>
          <div className="bg-white p-6 border-2 border-sce-border rounded-lg shadow-md mb-8">
            <div className="flex items-center mb-4">
              <FileSearch className="h-6 w-6 text-sce-primary mr-3" />
              <h3 className="font-bold text-xl">Классы объектов</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded bg-green-50 border-green-200">
                <h4 className="font-bold text-green-700 mb-1">Safe (Безопасный)</h4>
                <p className="text-sm">Объекты, которые легко содержать и не представляют серьезной угрозы</p>
              </div>
              <div className="p-3 border rounded bg-yellow-50 border-yellow-200">
                <h4 className="font-bold text-yellow-700 mb-1">Euclid (Евклид)</h4>
                <p className="text-sm">Объекты, которые требуют особых условий содержания или не полностью изучены</p>
              </div>
              <div className="p-3 border rounded bg-red-50 border-red-200">
                <h4 className="font-bold text-red-700 mb-1">Keter (Кетер)</h4>
                <p className="text-sm">Объекты, которые крайне сложно содержать или представляют высокую угрозу</p>
              </div>
              <div className="p-3 border rounded bg-purple-50 border-purple-200">
                <h4 className="font-bold text-purple-700 mb-1">Thaumiel (Таумиэль)</h4>
                <p className="text-sm">Объекты, которые могут быть использованы Фондом для содержания других объектов</p>
              </div>
              <div className="p-3 border rounded bg-gray-50 border-gray-200">
                <h4 className="font-bold text-gray-700 mb-1">Neutralized (Нейтрализованный)</h4>
                <p className="text-sm">Объекты, которые больше не проявляют аномальных свойств</p>
              </div>
              <div className="p-3 border rounded bg-blue-50 border-blue-200">
                <h4 className="font-bold text-blue-700 mb-1">Explained (Объяснённый)</h4>
                <p className="text-sm">Явления или объекты, которые вначале считались аномальными, но впоследствии получили научное объяснение</p>
              </div>
            </div>
          </div>
        </div>

        {/* Уровни доступа */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-sce-primary mb-6 pb-3 border-b-2 border-sce-border">
            Уровни доступа
          </h2>
          <div className="bg-white p-6 border-2 border-sce-border rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-sce-primary mr-3" />
              <h3 className="font-bold text-xl">Иерархия допусков</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="sce-clearance-badge sce-clearance-1 w-24 mr-4">Уровень 1</span>
                <span>Базовый уровень доступа для рядовых сотрудников и исследователей</span>
              </li>
              <li className="flex items-center">
                <span className="sce-clearance-badge sce-clearance-2 w-24 mr-4">Уровень 2</span>
                <span>Повышенный доступ для ведущих исследователей и сотрудников службы безопасности</span>
              </li>
              <li className="flex items-center">
                <span className="sce-clearance-badge sce-clearance-3 w-24 mr-4">Уровень 3</span>
                <span>Высокий уровень доступа для начальников отделов и специалистов по опасным объектам</span>
              </li>
              <li className="flex items-center">
                <span className="sce-clearance-badge sce-clearance-4 w-24 mr-4">Уровень 4</span>
                <span>Особый доступ для директоров департаментов и высшего руководства</span>
              </li>
              <li className="flex items-center">
                <span className="sce-clearance-badge sce-clearance-5 w-24 mr-4">Уровень 5</span>
                <span>Максимальный доступ для членов Совета O5 и основных руководителей Фонда</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Международное присутствие */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-sce-primary mb-6 pb-3 border-b-2 border-sce-border">
            Международное присутствие
          </h2>
          <div className="bg-white p-6 border-2 border-sce-border rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-sce-primary mr-3" />
              <h3 className="font-bold text-xl">Глобальная сеть объектов</h3>
            </div>
            <p className="mb-4">
              Фонд SCE располагает сетью из более чем 100 объектов различного назначения по всему миру, 
              включая исследовательские центры, хранилища и сдерживающие комплексы. Основные объекты:
            </p>
            <ul className="space-y-2 list-disc pl-6 mb-4">
              <li>Штаб-квартира — секретное местоположение в Центральной Европе</li>
              <li>Исследовательский комплекс "Альфа" — Северная Америка</li>
              <li>Хранилище высокой безопасности "Омега" — Сибирь</li>
              <li>Центр сдерживания "Бета" — Южная Америка</li>
              <li>Морской комплекс "Нептун" — Тихий океан</li>
              <li>Аварийный бункер "Зеро" — Антарктида</li>
            </ul>
            <p>
              Расположение всех объектов и детали их деятельности строго засекречены даже для большинства сотрудников Фонда.
            </p>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-sce-primary mb-4">Присоединяйтесь к миссии Фонда SCE</h2>
          <p className="mb-6 text-lg">
            Человечество нуждается в защите от того, чего не понимает. Каждый день наши исследователи, 
            агенты и специалисты работают по всему миру, чтобы обнаруживать, сдерживать и изучать аномалии.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button asChild className="sce-button" size="lg">
              <Link to="/register">Присоединиться к Фонду</Link>
            </Button>
            <Button asChild variant="outline" className="sce-button-outline" size="lg">
              <Link to="/objects">Исследовать объекты SCE</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
