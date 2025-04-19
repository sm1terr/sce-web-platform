import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getSCEObjectById, getCurrentUser } from "@/lib/api";
import { SCEObject, ObjectClass, ClearanceLevel } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, ArrowLeft, FileWarning, Lock, Eye, Calendar, MapPin, User } from "lucide-react";

const ObjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [object, setObject] = useState<SCEObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchObject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getSCEObjectById(id);
        
        if (response.success && response.data) {
          setObject(response.data);
        } else {
          setError(response.error || "Не удалось загрузить данные об объекте SCE");
          
          // Если ошибка связана с отсутствием доступа, показываем соответствующее уведомление
          if (response.error?.includes("Доступ запрещен")) {
            toast({
              title: "Доступ запрещен",
              description: response.error,
              variant: "destructive",
            });
          }
        }
      } catch (err) {
        setError("Произошла ошибка при загрузке объекта SCE");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, [id, toast]);

  // Получить цвет для класса объекта
  const getObjectClassColor = (objectClass: ObjectClass) => {
    const classColors = {
      [ObjectClass.SAFE]: "bg-sce-safe",
      [ObjectClass.EUCLID]: "bg-sce-euclid",
      [ObjectClass.KETER]: "bg-sce-keter",
      [ObjectClass.THAUMIEL]: "bg-sce-thaumiel",
      [ObjectClass.NEUTRALIZED]: "bg-sce-neutralized",
      [ObjectClass.EXPLAINED]: "bg-sce-explained"
    };
    
    return classColors[objectClass] || "bg-gray-500";
  };

  // Получить локализованное название класса объекта
  const getObjectClassName = (objectClass: ObjectClass) => {
    const classNames = {
      [ObjectClass.SAFE]: "Безопасный",
      [ObjectClass.EUCLID]: "Евклид",
      [ObjectClass.KETER]: "Кетер",
      [ObjectClass.THAUMIEL]: "Таумиэль",
      [ObjectClass.NEUTRALIZED]: "Нейтрализованный",
      [ObjectClass.EXPLAINED]: "Объяснённый"
    };
    
    return classNames[objectClass] || objectClass;
  };

  // Получить строку с уровнем доступа
  const getClearanceString = (level?: ClearanceLevel) => {
    if (!level) return "Уровень 1";
    
    const levelMap: Record<ClearanceLevel, string> = {
      [ClearanceLevel.LEVEL_1]: "Уровень 1",
      [ClearanceLevel.LEVEL_2]: "Уровень 2",
      [ClearanceLevel.LEVEL_3]: "Уровень 3",
      [ClearanceLevel.LEVEL_4]: "Уровень 4",
      [ClearanceLevel.LEVEL_5]: "Уровень 5"
    };
    
    return levelMap[level];
  };

  // Получить цвет для бейджа уровня доступа
  const getClearanceColor = (level?: ClearanceLevel) => {
    if (!level) return "sce-clearance-1";
    
    const colorMap: Record<ClearanceLevel, string> = {
      [ClearanceLevel.LEVEL_1]: "sce-clearance-1",
      [ClearanceLevel.LEVEL_2]: "sce-clearance-2",
      [ClearanceLevel.LEVEL_3]: "sce-clearance-3",
      [ClearanceLevel.LEVEL_4]: "sce-clearance-4",
      [ClearanceLevel.LEVEL_5]: "sce-clearance-5"
    };
    
    return colorMap[level];
  };

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Неизвестно";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <h1 className="text-3xl font-bold text-sce-primary mb-6 text-center">Загрузка данных объекта</h1>
          <div className="text-center py-10">Получение информации из базы данных...</div>
        </div>
      </Layout>
    );
  }

  if (error || !object) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Назад
              </Button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-red-100 p-4 rounded-full mb-6">
                <FileWarning className="h-12 w-12 text-red-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-sce-primary mb-4 text-center">
                Доступ к объекту запрещен
              </h1>
              
              <Alert variant="destructive" className="max-w-lg mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error || "Объект не найден или у вас нет прав для просмотра"}</AlertDescription>
              </Alert>
              
              {!currentUser && (
                <div className="mb-6 text-center max-w-md">
                  <p className="mb-4">
                    Для доступа к защищенным материалам Фонда SCE необходимо авторизоваться в системе.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button asChild>
                      <Link to="/login">Вход в систему</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/register">Регистрация</Link>
                    </Button>
                  </div>
                </div>
              )}
              
              <Button asChild variant="outline">
                <Link to="/objects">Вернуться к списку объектов</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Назад к списку объектов
            </Button>
            
            {currentUser?.role === "ADMIN" && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/admin/objects/edit/${object.id}`}>Редактировать объект</Link>
              </Button>
            )}
          </div>
          
          {/* Заголовок объекта */}
          <div className="sce-object-header mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="sce-object-number">SCE-{object.number}</h1>
              <Badge className={`sce-clearance-badge ${getClearanceColor(object.requiredClearance)}`}>
                {getClearanceString(object.requiredClearance)}
              </Badge>
            </div>
            
            <h2 className="sce-object-title">{object.title}</h2>
            
            <div className="flex items-center space-x-4 mt-4">
              <Badge className={`sce-object-class ${
                getObjectClassColor(object.objectClass).replace('bg-', 'sce-object-class-')
              }`}>
                {getObjectClassName(object.objectClass)}
              </Badge>
              
              <span className="text-white text-sm flex items-center">
                <Eye className="mr-1 h-4 w-4" /> Доступ: {getClearanceString(object.requiredClearance)}
              </span>
            </div>
          </div>
          
          {/* Содержимое объекта */}
          <div className="sce-object-content">
            {/* Информация об обнаружении */}
            {(object.discoveryLocation || object.discoveryDate || object.discoveredBy) && (
              <div className="mb-6 p-4 bg-sce-backgroundAlt rounded-md">
                <h3 className="font-bold text-lg mb-3 text-sce-primary">Информация об обнаружении</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {object.discoveryLocation && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-sce-primary mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Место обнаружения</p>
                        <p>{object.discoveryLocation}</p>
                      </div>
                    </div>
                  )}
                  
                  {object.discoveryDate && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-sce-primary mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Дата обнаружения</p>
                        <p>{formatDate(object.discoveryDate)}</p>
                      </div>
                    </div>
                  )}
                  
                  {object.discoveredBy && (
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-sce-primary mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Обнаружен</p>
                        <p>{object.discoveredBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Особые меры содержания */}
            <div className="mb-8">
              <h3 className="sce-section-title">Особые меры содержания</h3>
              <div className="prose max-w-none">
                {object.containmentProcedures.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            {/* Описание */}
            <div className="mb-8">
              <h3 className="sce-section-title">Описание</h3>
              <div className="prose max-w-none">
                {object.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            {/* Дополнительные примечания */}
            {object.additionalNotes && (
              <div className="mb-8">
                <h3 className="sce-section-title">Дополнительные примечания</h3>
                <div className="prose max-w-none">
                  {object.additionalNotes.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {/* Изображения */}
            {object.images && object.images.length > 0 && (
              <div className="mb-8">
                <h3 className="sce-section-title">Фотоматериалы</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {object.images.map((image, index) => (
                    <div key={index} className="border border-sce-border rounded-md overflow-hidden">
                      <img 
                        src={image || "/placeholder.svg"} 
                        alt={`SCE-${object.number} - изображение ${index + 1}`} 
                        className="w-full h-auto"
                      />
                      <div className="p-2 bg-sce-backgroundAlt text-sm">
                        Фото {index + 1}: SCE-{object.number}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Связанные объекты */}
            {object.relatedObjects && object.relatedObjects.length > 0 && (
              <div className="mb-8">
                <h3 className="sce-section-title">Связанные объекты</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {object.relatedObjects.map((relatedObj, index) => (
                    <li key={index}>
                      <Link 
                        to={`/objects/${relatedObj}`} 
                        className="text-sce-link hover:text-sce-hover"
                      >
                        SCE-{relatedObj}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Информация о документе */}
            <div className="mt-12 pt-4 border-t border-sce-border text-sm text-muted-foreground">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Внесено в базу:</p>
                  <p>{formatDate(object.createdAt)}</p>
                </div>
                <div>
                  <p className="font-medium">Последнее обновление:</p>
                  <p>{formatDate(object.updatedAt)}</p>
                </div>
                <div>
                  <p className="font-medium">Требуемый уровень доступа:</p>
                  <p>{getClearanceString(object.requiredClearance)}</p>
                </div>
              </div>
              
              {/* Напоминание о конфиденциальности */}
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-800">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lock className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="font-bold">КОНФИДЕНЦИАЛЬНО</p>
                    <p>
                      Несанкционированное раскрытие информации, содержащейся в этом документе, 
                      является нарушением протоколов безопасности Фонда SCE и влечет за собой 
                      дисциплинарные меры вплоть до применения амнезиаков класса A.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ObjectDetail;
