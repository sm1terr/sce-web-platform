import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy: React.FC = () => {
  return (
    <Layout>
      <div className="sce-container py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="border-b border-sce-border pb-4">
            <CardTitle className="text-3xl text-sce-primary">Политика конфиденциальности</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 prose">
            <h2>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ ФОНДА SCE</h2>
            <p className="text-muted-foreground text-sm">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
            
            <div className="space-y-6 mt-6">
              <section>
                <h3>1. ВВЕДЕНИЕ</h3>
                <p>
                  Фонд SCE (Secure. Control. Explore.) стремится защищать вашу личную информацию и 
                  обеспечивать ее безопасность. Эта Политика конфиденциальности объясняет, как 
                  мы собираем, используем и защищаем вашу личную информацию при использовании 
                  нашего веб-сайта и связанных с ним услуг.
                </p>
                <p>
                  Используя наш веб-сайт, вы соглашаетесь с условиями этой Политики конфиденциальности. 
                  Если вы не согласны с нашей политикой, пожалуйста, не используйте наш веб-сайт.
                </p>
              </section>

              <section>
                <h3>2. СОБИРАЕМАЯ ИНФОРМАЦИЯ</h3>
                <p>Мы можем собирать следующие типы информации:</p>
                <ul>
                  <li>
                    <strong>Личная информация:</strong> Имя пользователя, адрес электронной почты и 
                    другие данные, которые вы предоставляете при регистрации или взаимодействии с нашими услугами.
                  </li>
                  <li>
                    <strong>Информация о сеансе:</strong> Данные о вашем взаимодействии с нашим веб-сайтом, 
                    включая IP-адрес, тип устройства, тип браузера, страницы, которые вы посещаете, и действия, 
                    которые вы выполняете.
                  </li>
                  <li>
                    <strong>Файлы cookie:</strong> Мы используем файлы cookie для улучшения вашего опыта работы с сайтом.
                  </li>
                </ul>
              </section>

              <section>
                <h3>3. ИСПОЛЬЗОВАНИЕ ИНФОРМАЦИИ</h3>
                <p>Собранная информация может использоваться для:</p>
                <ul>
                  <li>Создания и управления вашей учетной записью</li>
                  <li>Предоставления и улучшения наших услуг</li>
                  <li>Персонализации вашего опыта на сайте</li>
                  <li>Связи с вами по поводу обновлений, объявлений или других важных сообщений</li>
                  <li>Обеспечения безопасности нашего веб-сайта и защиты от мошенничества</li>
                </ul>
              </section>

              <section>
                <h3>4. ОБМЕН ИНФОРМАЦИЕЙ</h3>
                <p>
                  Фонд SCE не продает, не обменивает и не передает вашу личную информацию третьим лицам 
                  без вашего согласия, за исключением случаев, когда это необходимо для предоставления 
                  запрошенных услуг или когда этого требует закон.
                </p>
              </section>

              <section>
                <h3>5. ЗАЩИТА ДАННЫХ</h3>
                <p>
                  Мы применяем различные меры безопасности для защиты вашей личной информации. 
                  Однако помните, что ни один метод передачи через Интернет или электронного хранения 
                  не является на 100% безопасным. Хотя мы стремимся использовать коммерчески приемлемые 
                  средства для защиты вашей личной информации, мы не можем гарантировать ее абсолютную безопасность.
                </p>
              </section>

              <section>
                <h3>6. ПРАВА ПОЛЬЗОВАТЕЛЯ</h3>
                <p>Вы имеете право:</p>
                <ul>
                  <li>Получать доступ к своей личной информации</li>
                  <li>Исправлять неточные или неполные данные</li>
                  <li>Запрашивать удаление своих данных</li>
                  <li>Возражать против определенных видов обработки данных</li>
                  <li>Отозвать свое согласие в любое время</li>
                </ul>
              </section>

              <section>
                <h3>7. ИЗМЕНЕНИЯ В ПОЛИТИКЕ КОНФИДЕНЦИАЛЬНОСТИ</h3>
                <p>
                  Мы можем обновлять эту политику конфиденциальности время от времени. 
                  Мы уведомим вас о любых значительных изменениях, разместив новую политику 
                  на этой странице и обновив дату последнего обновления.
                </p>
              </section>

              <section>
                <h3>8. СВЯЗЬ С НАМИ</h3>
                <p>
                  Если у вас есть вопросы или предложения относительно нашей Политики конфиденциальности, 
                  пожалуйста, свяжитесь с нами по адресу: privacy@sce-foundation.org
                </p>
              </section>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sce-secondary text-sm">
                © {new Date().getFullYear()} SCE Foundation. Все права защищены.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Privacy;
