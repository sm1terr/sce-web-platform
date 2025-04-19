import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createSCEObject, getCurrentUser } from "@/lib/api";
import { ObjectClass, ClearanceLevel, UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateObject: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Состояние формы
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [objectClass, setObjectClass] = useState<ObjectClass>(ObjectClass.SAFE);
  const [containmentProcedures, setContainmentProcedures] = useState("");
  const [description, setDescription] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [discoveryLocation, setDiscoveryLocation] = useState("");
  const [discoveryDate, setDiscoveryDate] = useState("");
  const [discoveredBy, setDiscoveredBy] = useState("");
  const [requiredClearance, setRequiredClearance] = useState<ClearanceLevel>(ClearanceLevel.LEVEL_1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Проверка прав доступа
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  if (currentUser.role !== UserRole.ADMIN) {
    navigate("/");
    toast({
      title: "Доступ запрещен",
      description: "У вас нет прав администратора для создания объектов",
      variant: "destructive",
    });
    return null;
  }

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!title || !number || !containmentProcedures || !description) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createSCEObject({
        title,
        number,
        objectClass,
        containmentProcedures,
        description,
        additionalNotes: additionalNotes || undefined,
        discoveryLocation: discoveryLocation || undefined,
        discoveryDate: discoveryDate || undefined,
        discoveredBy: discoveredBy || undefined,
        requiredClearance,
        // Другие поля по мере необходимости
      });

      if (response.success && response.data) {
        toast({
          title: "Объект SCE создан",
          description: `Объект SCE-${number} успешно добавлен в базу данных`,
          variant: "default",
        });
        navigate(`/objects/${response.data.id}`);
      } else {
        setError(response.error || "Не удалось создать объект SCE");
      }
    } catch (err) {
      console.error("Ошибка при создании объекта SCE:", err);
      setError("Произошла ошибка при попытке создать объект SCE");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="sce-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-sce-primary mb-6">Создание нового объекта SCE</h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Основная информация об объекте</CardTitle>
                <CardDescription>
                  Введите основные данные для классификации и идентификации объекта SCE
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="number">Номер объекта SCE *</Label>
                    <Input
                      id="number"
                      placeholder="Например: 173"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Уникальный идентификационный номер объекта
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectClass">Класс объекта *</Label>
                    <Select 
                      value={objectClass} 
                      onValueChange={(value) => setObjectClass(value as ObjectClass)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите класс" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ObjectClass.SAFE}>Безопасный (Safe)</SelectItem>
                        <SelectItem value={ObjectClass.EUCLID}>Евклид (Euclid)</SelectItem>
                        <SelectItem value={ObjectClass.KETER}>Кетер (Keter)</SelectItem>
                        <SelectItem value={ObjectClass.THAUMIEL}>Таумиэль (Thaumiel)</SelectItem>
                        <SelectItem value={ObjectClass.NEUTRALIZED}>Нейтрализованный (Neutralized)</SelectItem>
                        <SelectItem value={ObjectClass.EXPLAINED}>Объяснённый (Explained)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Категория опасности и сложности содержания
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Название объекта *</Label>
                  <Input
                    id="title"
                    placeholder="Например: Статуя с движущимися глазами"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Краткое описательное название объекта
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredClearance">Требуемый уровень доступа *</Label>
                  <Select 
                    value={requiredClearance} 
                    onValueChange={(value) => setRequiredClearance(value as ClearanceLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень доступа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ClearanceLevel.LEVEL_1}>Уровень 1</SelectItem>
                      <SelectItem value={ClearanceLevel.LEVEL_2}>Уровень 2</SelectItem>
                      <SelectItem value={ClearanceLevel.LEVEL_3}>Уровень 3</SelectItem>
                      <SelectItem value={ClearanceLevel.LEVEL_4}>Уровень 4</SelectItem>
                      <SelectItem value={ClearanceLevel.LEVEL_5}>Уровень 5</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Минимальный уровень доступа, необходимый для получения информации об объекте
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание объекта *</Label>
                  <Textarea
                    id="description"
                    placeholder="Подробное описание физических свойств и аномальных характеристик объекта..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="min-h-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    Детальное описание физических и аномальных свойств объекта
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="containmentProcedures">Процедуры содержания *</Label>
                  <Textarea
                    id="containmentProcedures"
                    placeholder="Стандартные процедуры, необходимые для безопасного содержания объекта..."
                    value={containmentProcedures}
                    onChange={(e) => setContainmentProcedures(e.target.value)}
                    required
                    className="min-h-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    Протоколы и меры безопасности для содержания объекта
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Дополнительные примечания</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Любые дополнительные заметки, наблюдения или эксперименты..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="min-h-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    Экспериментальные данные, исследования и дополнительная информация
                  </p>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-lg">Информация об обнаружении</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="discoveryLocation">Место обнаружения</Label>
                      <Input
                        id="discoveryLocation"
                        placeholder="Например: Лес возле г. Новосибирск, Россия"
                        value={discoveryLocation}
                        onChange={(e) => setDiscoveryLocation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discoveryDate">Дата обнаружения</Label>
                      <Input
                        id="discoveryDate"
                        type="date"
                        value={discoveryDate}
                        onChange={(e) => setDiscoveryDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discoveredBy">Кем обнаружен</Label>
                    <Input
                      id="discoveredBy"
                      placeholder="Имя или группа, обнаружившая объект"
                      value={discoveredBy}
                      onChange={(e) => setDiscoveredBy(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                  Отмена
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Создание..." : "Создать объект SCE"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateObject;
