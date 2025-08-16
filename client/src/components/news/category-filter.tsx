import { Button } from "@/components/ui/button";
import { Category } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        className={cn(
          "rounded-full font-medium transition-colors category-filter",
          selectedCategory === null && "active bg-primary text-white"
        )}
        onClick={() => onCategoryChange(null)}
        data-testid="filter-all"
      >
        Todas
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full font-medium transition-colors category-filter",
            selectedCategory === category.id && "active"
          )}
          style={selectedCategory === category.id ? { 
            backgroundColor: category.color, 
            borderColor: category.color,
            color: 'white'
          } : {}}
          onClick={() => onCategoryChange(category.id)}
          data-testid={`filter-${category.slug}`}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
