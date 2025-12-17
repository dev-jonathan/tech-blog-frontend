import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/api';

interface CategoryBadgesProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  allowDeselect?: boolean;
}

export function CategoryBadges({
  categories,
  selectedCategoryId,
  onCategoryChange,
  allowDeselect = true,
}: CategoryBadgesProps) {
  const handleClick = (categoryId: number) => {
    if (allowDeselect && selectedCategoryId === categoryId) {
      onCategoryChange(null);
    } else {
      onCategoryChange(categoryId);
    }
  };

  if (!categories.length) {
    return (
      <div className="px-2">
        <p className="text-muted-foreground text-sm">
          Nenhuma categoria disponível
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 md:flex-wrap">
        {categories.map((category) => (
          <Badge
            key={category.id}
            className={`h-8 shrink-0 cursor-pointer rounded-xl border-0 px-4 text-sm font-medium transition-colors hover:opacity-80 ${
              selectedCategoryId === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-foreground'
            }`}
            onClick={() => handleClick(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
