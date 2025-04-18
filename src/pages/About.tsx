import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <Layout>
      <div className="sce-container py-12">
        <h1 className="text-3xl font-bold text-sce-primary mb-8">О Фонде SCE</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Миссия Фонда SCE</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Фонд SCE (Secure, Control, Explore) - это организация, созданная для защиты человечества от аномальных объектов, сущностей и явлений, нарушающих естественные законы реальности. Наша миссия основана на трех ключевых принципах:
              </p>
              
              <ul>
                <li>
                  <strong>Secure (Сдерживание):</strong> Обнаружение и надежное сдерживание аномалий, представляющих угрозу для человечества и нормального функционирования мира.
                </li>
                <li>
                  <strong>Control (Контроль):</strong> Разработка эффективных процедур содержания и управление объектами для предотвращения инцидентов и минимизации рисков.
                </li>
                <li>
                  <strong>Explore (Исследование):</strong> Научное изучение аномальных явлений для расширения человеческого знания и потенциального применения открытий на благо человечества.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>История Фонда</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Фонд SCE был основан в середине XX века после серии масштабных аномальных инцидентов, которые привели к значительным человеческим жертвам и поставили под угрозу раскрытие существования аномалий широкой общественности. 
              </p>
              
              <p>
                Изначально небольшая группа ученых и военных специалистов, Фонд SCE вырос в международную организацию с множеством объектов и тысячами сотрудников по всему миру. Наша структура и деятельность остаются строго засекреченными, с доступом к информации, регулируемым на основе системы допусков.
              </p>
              
              <p>
                За десятилетия работы Фонд предотвратил множество потенциальных катастроф, от локальных аномальных явлений до событий класса "Конец Света", способных поставить под угрозу само существование нашей реальности.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Структура и организация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Классификация объектов</h3>
                  <p className="mb-4">
                    Фонд SCE классифицирует аномалии по степени опасности и сложности содержания:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-sce-border p-4 rounded-md">
                      <h4 className="font-semibold text-green-700">Safe (Безопасный)</h4>
                      <p className="text-sm">
                        Объекты, которые могут быть надежно и легко содержаться при соблюдении стандартных процедур.
                      </p>
                    </div>
                    <div className="border border-sce-border p-4 rounded-md">
                      <h4 className="font-semibold text-yellow-700">Euclid (Евклид)</h4>
                      <p className="text-sm">
                        Объекты, требующие более сложных процедур содержания и представляющие умеренную опасность.
                      </p>
                    </div>
                    <div className="border border-sce-border p-4 rounded-md">
                      <h4 className="font-semibold text-red-700">Keter (Кетер)</h4>
                      <p className="text-sm">
                        Крайне опасные объекты, трудно поддающиеся содержанию и представляющие значительную угрозу.
                      </p>
                    </div>
                    <div className="border border-sce-border p-4 rounded-md">
                      <h4 className="font-semibold text-purple-700">Thaumiel (Таумиель)</h4>
                      <p className="text-sm">
                        Редкие объекты, используемые Фондом для содержания или нейтрализации других опасных аномалий.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-2">Персонал и отделы</h3>
                  <p className="mb-4">
                    Фонд SCE состоит из нескольких специализированных отделов:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="font-semibold min-w-36">Исследовательский отдел:</span>
                      <span>Изучение аномальных объектов и явлений</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold min-w-36">Отдел содержания:</span>
                      <span>Разработка и поддержание процедур содержания</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold min-w-36">Мобильные оперативные группы:</span>
                      <span>Оперативные подразделения для обнаружения, захвата и транспортировки аномалий</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold min-w-36">Отдел безопасности:</span>
                      <span>Защита объектов Фонда и предотвращение нарушений</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold min-w-36">Отдел информации:</span>
                      <span>Документирование и классификация данных, управление информационной безопасностью</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold min-w-36">Отдел амнезиаков:</span>
                      <span>Обеспечение секретности и устранение следов аномальных инцидентов</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Этические принципы</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Несмотря на часто суровые меры, необходимые для обеспечения безопасности, Фонд SCE руководствуется рядом этических принципов:
              </p>
              
              <ul>
                <li>Защита человечества всегда является приоритетной задачей</li>
                <li>Минимизация человеческих жертв при выполнении миссии</li>
                <li>Гуманное обращение с разумными аномальными сущностями, когда это возможно</li>
                <li>Использование научного метода и объективности в исследованиях</li>
                <li>Ответственное использование аномальных объектов и полученных знаний</li>
              </ul>
              
              <p>
                В случаях, когда требуется сделать сложный этический выбор, мы руководствуемся принципом наименьшего вреда, стремясь минимизировать общие негативные последствия для человечества и мира в целом.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;
