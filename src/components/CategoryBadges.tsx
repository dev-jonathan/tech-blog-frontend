import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/constants';

interface CategoryBadgesProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  allowDeselect?: boolean;
}

export function CategoryBadges({
  selectedCategory,
  onCategoryChange,
  allowDeselect = true,
}: CategoryBadgesProps) {
  const handleClick = (category: string) => {
    if (allowDeselect && selectedCategory === category) {
      onCategoryChange(null);
    } else {
      onCategoryChange(category);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 md:flex-wrap">
        {CATEGORIES.map((category) => (
          <Badge
            key={category}
            className={`h-8 shrink-0 cursor-pointer rounded-xl border-0 px-4 text-sm font-medium transition-colors hover:opacity-80 ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-foreground'
            }`}
            onClick={() => handleClick(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
