import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { createSCEObject } from "@/lib/api";
import { ObjectClass } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CreateObject = () => {
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [objectClass, setObjectClass] = useState<ObjectClass>(ObjectClass.SAFE);
  const [containmentProcedures, setContainmentProcedures] = useState("");
  const [description, setDescription] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createSCEObject({
        number,
        title,
        objectClass,
        containmentProcedures,
        description,
        additionalNotes: additionalNotes || undefined,
        images: []
      });

      if (response.success && response.data) {
        toast({
          title: "Объект создан",
          description: "Объект SCE успешно добавлен в базу данных",
          variant: "default",
        });
        navigate(`/objects/${response.data.id}`);
      } else {
        toast({
          title: "Ошибка",
          description: response.error || "Не удалось создать объект",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating object:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании объекта",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-sce-primary">Создать новый объект SCE</h1>
            <Button asChild variant="outline">
              <Link to="/admin"><ChevronLeft className="mr-2 h-4 w-4" /> Назад к панели управления</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Информация об объекте</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="number">Номер объекта</Label>
                    <Input
                      id="number"
                      placeholder="001"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Уникальный номер объекта в формате XXX
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectClass">Класс объекта</Label>
                    <Select
                      value={objectClass}
                      onValueChange={(value) => setObjectClass(value as ObjectClass)}
                    >
                      <SelectTrigger id="objectClass">
                        <SelectValue placeholder="Выберите класс" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ObjectClass.SAFE}>Safe</SelectItem>
                        <SelectItem value={ObjectClass.EUCLID}>Euclid</SelectItem>
                        <SelectItem value={ObjectClass.KETER}>Keter</SelectItem>
                        <SelectItem value={ObjectClass.THAUMIEL}>Thaumiel</SelectItem>
                        <SelectItem value={ObjectClass.NEUTRALIZED}>Neutralized</SelectItem>
                        <SelectItem value={ObjectClass.EXPLAINED}>Explained</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Название объекта</Label>
                  <Input
                    id="title"
                    placeholder="Название объекта"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="containmentProcedures">Процедуры содержания</Label>
                  <Textarea
                    id="containmentProcedures"
                    placeholder="Опишите процедуры содержания объекта..."
                    value={containmentProcedures}
                    onChange={(e) => setContainmentProcedures(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    placeholder="Опишите объект и его свойства..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Дополнительные заметки (необязательно)</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Дополнительная информация, результаты экспериментов и т.д..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin")}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    className="bg-sce-primary hover:bg-sce-hover"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Создание..." : "Создать объект"}
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

export default CreateObject;
