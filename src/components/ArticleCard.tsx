import { PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';

interface ArticleCardProps {
  id: number;
  title: string;
  author: string;
  content: string;
  tag: string;
  banner: string;
}

export function ArticleCard({
  id,
  title,
  content,
  tag,
  banner,
}: ArticleCardProps) {
  return (
    <div className="border-border bg-card hover:bg-accent/50 flex w-full items-center justify-between gap-4 border-b px-4 py-3 transition-colors">
      <Link to={`/articles/${id}`} className="flex flex-1 items-center gap-4">
        {/* Thumbnail */}
        <img
          src={banner}
          alt={title}
          className="h-14 w-14 shrink-0 rounded-lg object-cover"
        />

        {/* Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-foreground text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-1 text-sm font-normal">
            {content}
          </p>
          <Badge className="bg-accent text-foreground h-auto w-fit rounded-xl border-0 px-2 py-0 text-xs font-medium">
            {tag}
          </Badge>
        </div>
      </Link>

      {/* Edit Icon */}
      <Link
        to={`/articles/${id}/edit`}
        className="shrink-0 transition-colors hover:opacity-70"
      >
        <PenSquare className="text-muted-foreground h-6 w-6" />
      </Link>
    </div>
  );
}
