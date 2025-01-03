import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  title: string;
  price: number;
  type: "SALE" | "RENT" | "DONATION" | "EXCHANGE";
  condition?: "NOVO" | "SEMINOVO" | "USADO" | "DEFEITO";
  category: {
    name: string;
    type: "SERVICE" | "PRODUCT";
  };
  subcategory?: string;
  imageUrl: string;
  user: {
    name: string;
    commercial_name?: string;
  };
}

export const ListingCard = ({ 
  title, 
  price, 
  type,
  condition,
  category, 
  subcategory,
  imageUrl,
  user
}: ListingCardProps) => {
  const categoryColor = category.type === "SERVICE" ? "blue" : "green";
  const displayName = user.commercial_name || user.name;
  
  const getTypeLabel = (type: string) => {
    const labels = {
      SALE: "Venda",
      RENT: "Aluguel",
      DONATION: "Doação",
      EXCHANGE: "Troca"
    };
    return labels[type as keyof typeof labels] || type;
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <Badge 
              variant="secondary"
              className={cn(
                "ml-2",
                categoryColor === "blue" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
              )}
            >
              {category.name}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {subcategory && (
              <Badge variant="outline">
                {subcategory}
              </Badge>
            )}
            {/* Mostrar tipo apenas para produtos */}
            {category.type === "PRODUCT" && (
              <Badge variant="outline" className="bg-purple-100">
                {getTypeLabel(type)}
              </Badge>
            )}
            {condition && (
              <Badge variant="outline" className="bg-orange-100">
                {condition}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{displayName}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {type !== "DONATION" ? (
          <p className="font-bold text-lg">
            {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        ) : (
          <p className="font-bold text-lg text-green-600">Gratuito</p>
        )}
      </CardFooter>
    </Card>
  );
};