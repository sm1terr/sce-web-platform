import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getSCEObjectById } from "@/lib/api";
import { SCEObject, ObjectClass } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";

// Helper function to get class color
const getClassColor = (objectClass: ObjectClass): string => {
  switch (objectClass) {
    case ObjectClass.SAFE:
      return "bg-green-600 hover:bg-green-700";
    case ObjectClass.EUCLID:
      return "bg-yellow-600 hover:bg-yellow-700";
    case ObjectClass.KETER:
      return "bg-red-600 hover:bg-red-700";
    case ObjectClass.THAUMIEL:
      return "bg-purple-600 hover:bg-purple-700";
    case ObjectClass.NEUTRALIZED:
      return "bg-gray-600 hover:bg-gray-700";
    case ObjectClass.EXPLAINED:
      return "bg-blue-600 hover:bg-blue-700";
    default:
      return "bg-gray-600 hover:bg-gray-700";
  }
};

const ObjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [object, setObject] = useState<SCEObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObject = async () => {
      if (!id) {
        setError("Идентификатор объекта не указан");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getSCEObjectById(id);
        
        if (response.success && response.data) {
          setObject(response.data);
        } else {
          setError("Объект не найден");
        }
      } catch (error) {
        setError("Произошла ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    };

    fetchObject();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <p className="text-center">Загрузка объекта SCE...</p>
        </div>
      </Layout>
    );
  }

  if (error || !object) {
    return (
      <Layout>
        <div className="sce-container py-12">
          <div className="max-w-3xl mx-auto">
            <Button asChild variant="outline" className="mb-6">
              <Link to="/objects"><ChevronLeft className="mr-2 h-4 w-4" /> Назад к списку объектов</Link>
            </Button>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-red-600">{error || "Объект не найден"}</p>
                <p className="text-center mt-2">
                  Запрашиваемый объект не существует или у вас недостаточно прав для доступа к нему.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const classColor = getClassColor(object.objectClass as ObjectClass);

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="outline" className="mb-6">
            <Link to="/objects"><ChevronLeft className="mr-2 h-4 w-4" /> Назад к списку объектов</Link>
          </Button>

          <div className="bg-white border border-sce-border rounded-lg overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-sce-primary text-white p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold">SCE-{object.number}</h1>
                  <h2 className="text-xl mt-1">{object.title}</h2>
                </div>
                <Badge className={`${classColor} text-lg px-4 py-1`}>
                  {object.objectClass}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Item Panel */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-sce-primary mb-4">Процедуры содержания</h3>
                <div className="prose max-w-none border-l-4 border-sce-primary pl-4 py-1 bg-gray-50">
                  <p>{object.containmentProcedures}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-sce-primary mb-4">Описание</h3>
                <div className="prose max-w-none">
                  <p>{object.description}</p>
                </div>
              </div>

              {/* Additional Notes (if any) */}
              {object.additionalNotes && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-xl font-bold text-sce-primary mb-4">Дополнительные заметки</h3>
                    <div className="prose max-w-none">
                      <p>{object.additionalNotes}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Images (if any) */}
              {object.images && object.images.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-xl font-bold text-sce-primary mb-4">Изображения</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {object.images.map((image, index) => (
                        <div key={index} className="border border-gray-200 rounded overflow-hidden">
                          <img 
                            src={image || "/placeholder.svg"} 
                            alt={`SCE-${object.number} - ${index + 1}`}
                            className="w-full h-48 object-cover" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Metadata */}
              <Separator className="my-6" />
              <div className="text-sm text-gray-500">
                <p>Создан: {new Date(object.createdAt).toLocaleDateString()}</p>
                <p>Последнее обновление: {new Date(object.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ObjectDetail;
