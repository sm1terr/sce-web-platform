import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ObjectClass, SCEObject } from "@/types";

interface ObjectCardProps {
  object: SCEObject;
}

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

const ObjectCard: React.FC<ObjectCardProps> = ({ object }) => {
  const classColor = getClassColor(object.objectClass as ObjectClass);

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-sce-primary">
            SCE-{object.number}
          </CardTitle>
          <Badge className={classColor}>
            {object.objectClass}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <h3 className="font-semibold text-lg mb-2">{object.title}</h3>
        <p className="text-sm text-gray-700 line-clamp-3">
          {object.description.substring(0, 150)}
          {object.description.length > 150 ? "..." : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/objects/${object.id}`} 
          className="text-sce-link hover:text-sce-hover text-sm font-medium"
        >
          Подробнее →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ObjectCard;
