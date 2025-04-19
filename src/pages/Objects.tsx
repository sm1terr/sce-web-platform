import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getSCEObjects, getCurrentUser } from "@/lib/api";
import { SCEObject, ObjectClass, ClearanceLevel } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Search } from "lucide-react";

const Objects: React.FC = () => {
  const [objects, setObjects] = useState<SCEObject[]>([]);
  const [filteredObjects, setFilteredObjects] = useState<SCEObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = getCurrentUser();

  // Загрузка данных
  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setLoading(true);
        const response = await getSCEObjects();
        
        if (response.success && response.data) {
          // Сортировка по номеру объекта
          const sortedObjects = [...response.data].sort((a, b) => {
            const aNum = parseInt(a.number);
            const bNum = parseInt(b.number);
            return !isNaN(aNum) && !isNaN(bNum) ? aNum - bNum : a.number.localeCompare(b.number);
          });
          
          setObjects(sortedObjects);
          setFilteredObjects(sortedObjects);
        } else {
          setError(response.error || "Не удалось загрузить объекты SCE");
        }
      } catch (err) {
        setError("Произошла ошибка при загрузке объектов SCE");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, []);

  // Фильтрация объектов при изменении активной вкладки или поискового запроса
  useEffect(() => {
    let result = [...objects];
    
    // Фильтрация по классу
    if (activeTab !== "all") {
      result = result.filter(obj => obj.objectClass === activeTab);
    }
    
    // Фильтрация по поисковому запросу
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(obj => 
        obj.title.toLowerCase().includes(query) || 
        obj.number.toLowerCase().includes(query) || 
        obj.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredObjects(result);
  }, [activeTab, searchQuery, objects]);

  // Обработка изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Получение цвета для класса объекта
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

  // Получение локализованного названия класса объекта
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

  // Получение строки с уровнем доступа
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

  // Получение цвета для бейджа уровня доступа
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

  if (loading) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <h1 className="text-3xl font-bold text-sce-primary mb-6 text-center">Архив объектов SCE</h1>
          <div className="text-center py-10">Загрузка объектов SCE...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <h1 className="text-3xl font-bold text-sce-primary mb-6 text-center">Архив объектов SCE</h1>
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sce-primary mb-3">Архив объектов SCE</h1>
          <p className="text-sce-secondary max-w-2xl mx-auto">
            База данных аномальных объектов, находящихся под контролем Фонда SCE. 
            Доступ к некоторым объектам может быть ограничен в зависимости от вашего уровня допуска.
          </p>
        </div>

        {/* Поисковая строка */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Поиск по номеру, названию или описанию объекта..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="flex justify-center mb-6 overflow-x-auto">
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value={ObjectClass.SAFE}>Безопасный</TabsTrigger>
              <TabsTrigger value={ObjectClass.EUCLID}>Евклид</TabsTrigger>
              <TabsTrigger value={ObjectClass.KETER}>Кетер</TabsTrigger>
              <TabsTrigger value={ObjectClass.THAUMIEL}>Таумиэль</TabsTrigger>
              <TabsTrigger value={ObjectClass.NEUTRALIZED}>Нейтрализованный</TabsTrigger>
              <TabsTrigger value={ObjectClass.EXPLAINED}>Объяснённый</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            {filteredObjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sce-secondary text-lg mb-4">
                  {searchQuery 
                    ? "По вашему запросу объекты не найдены." 
                    : "Объекты данного класса не найдены."}
                </p>
                {currentUser?.role === "ADMIN" && (
                  <Button asChild>
                    <Link to="/admin/objects/create">Создать новый объект SCE</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredObjects.map((object) => (
                  <Card key={object.id} className="sce-card flex flex-col h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={`${getObjectClassColor(object.objectClass)} text-white`}>
                          {getObjectClassName(object.objectClass)}
                        </Badge>
                        {object.requiredClearance && (
                          <Badge className={`sce-clearance-badge ${getClearanceColor(object.requiredClearance)}`}>
                            {getClearanceString(object.requiredClearance)}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="font-mono">SCE-{object.number}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <h3 className="text-xl font-bold mb-4">{object.title}</h3>
                      <p className="line-clamp-5 text-sce-text">
                        {object.description.substring(0, 200)}...
                      </p>
                    </CardContent>
                    <CardFooter className="pt-4">
                      <Button asChild className="w-full">
                        <Link to={`/objects/${object.id}`}>Подробнее</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Objects;
