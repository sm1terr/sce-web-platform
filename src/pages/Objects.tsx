import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getSCEObjects } from "@/lib/api";
import { SCEObject, ObjectClass } from "@/types";
import ObjectCard from "@/components/ObjectCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const Objects = () => {
  const [objects, setObjects] = useState<SCEObject[]>([]);
  const [filteredObjects, setFilteredObjects] = useState<SCEObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setIsLoading(true);
        const response = await getSCEObjects();
        
        if (response.success && response.data) {
          setObjects(response.data);
          setFilteredObjects(response.data);
        } else {
          setError("Не удалось загрузить объекты SCE");
        }
      } catch (error) {
        setError("Произошла ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjects();
  }, []);

  // Apply filters when search query or class filter changes
  useEffect(() => {
    let result = [...objects];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (obj) =>
          obj.number.toLowerCase().includes(query) ||
          obj.title.toLowerCase().includes(query) ||
          obj.description.toLowerCase().includes(query)
      );
    }
    
    // Apply class filter
    if (classFilter !== "ALL") {
      result = result.filter((obj) => obj.objectClass === classFilter);
    }
    
    setFilteredObjects(result);
  }, [searchQuery, classFilter, objects]);

  return (
    <Layout>
      <div className="sce-container py-12">
        <h1 className="text-3xl font-bold text-sce-primary mb-6">Объекты SCE</h1>
        
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search" className="mb-2 block">Поиск</Label>
            <Input
              id="search"
              placeholder="Поиск по номеру, названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="class-filter" className="mb-2 block">Класс объекта</Label>
            <Select
              value={classFilter}
              onValueChange={setClassFilter}
            >
              <SelectTrigger id="class-filter" className="w-full">
                <SelectValue placeholder="Все классы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Все классы</SelectItem>
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

        {isLoading ? (
          <div className="text-center py-12">
            <p>Загрузка объектов SCE...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : filteredObjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredObjects.map((object) => (
              <ObjectCard key={object.id} object={object} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-gray-200 rounded-md">
            <p className="text-lg">Объекты не найдены</p>
            {searchQuery || classFilter !== "ALL" ? (
              <p className="text-sm text-gray-500 mt-2">
                Попробуйте изменить параметры поиска
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                В базе данных пока нет объектов SCE
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Objects;
