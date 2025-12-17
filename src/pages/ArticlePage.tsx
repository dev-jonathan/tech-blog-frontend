import { Clock, User, LogOut } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CommentsSection } from '@/components/CommentsSection';
import { PageHeader, HeaderButton } from '@/components/PageHeader';
import articlesData from '@/assets/articles.json';

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = articlesData.find((a) => a.id === Number(id));

  const handleLogout = () => {
    navigate('/');
  };

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-xl font-medium">
          Artigo não encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <PageHeader
        action={
          <HeaderButton
            to="/"
            variant="logout"
            onClick={handleLogout}
            icon={<LogOut className="mr-2 h-4 w-4" />}
            mobileIcon={<LogOut className="h-5 w-5" />}
          >
            Sair
          </HeaderButton>
        }
      />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        {/* Article Header */}
        <div className="mb-6 flex flex-col gap-4">
          {/* Category Badge */}
          <Badge className="bg-accent text-foreground h-auto w-fit rounded-xl border-0 px-3 py-1 text-sm font-medium">
            {article.tag}
          </Badge>

          {/* Title */}
          <h1 className="text-foreground text-3xl font-bold md:text-4xl">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">
                Publicado por {article.author}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>15/01/2025</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg mb-12 max-w-none">
          <div className="text-foreground space-y-4 text-base leading-relaxed">
            <p>{article.content}</p>
          </div>
        </article>

        {/* Comments Section */}
        <CommentsSection comments={article.comments} />
      </main>
    </div>
  );
}
