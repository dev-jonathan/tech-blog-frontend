import { PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article } from '@/types/api';
import { getStoredUser } from '@/lib/auth';
import { Badge } from './ui/badge';

interface ArticleCardProps {
  article: Article;
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none"><rect width="96" height="96" rx="12" fill="%23F5F5F5"/><path d="M30 64L42 48L52 60L64 44L76 64H30Z" stroke="%23999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="32" r="6" fill="%23999"/></svg>';

export function ArticleCard({ article }: ArticleCardProps) {
  const { slug, title, excerpt, banner, category, author, content } = article;
  const currentUser = getStoredUser();
  const canEdit = currentUser?.userId === article.authorId;

  return (
    <div className="border-border bg-card hover:bg-accent/50 flex w-full items-center justify-between gap-4 border-b px-4 py-3 transition-colors">
      <Link to={`/articles/${slug}`} className="flex flex-1 items-center gap-4">
        {/* Thumbnail */}
        <img
          src={banner || FALLBACK_IMAGE}
          alt={title}
          className="h-14 w-14 shrink-0 rounded-lg object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {/* Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-foreground text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-1 text-sm font-normal">
            {excerpt || content}
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-accent text-foreground h-auto w-fit rounded-xl border-0 px-2 py-0 text-xs font-medium">
              {category?.name || 'Sem categoria'}
            </Badge>
            <span className="text-muted-foreground text-xs">
              {author?.name || 'Autor desconhecido'}
            </span>
          </div>
        </div>
      </Link>

      {/* Edit Icon */}
      {canEdit && (
        <Link
          to={`/articles/${slug}/edit`}
          className="shrink-0 transition-colors hover:opacity-70"
        >
          <PenSquare className="text-muted-foreground h-6 w-6" />
        </Link>
      )}
    </div>
  );
}
