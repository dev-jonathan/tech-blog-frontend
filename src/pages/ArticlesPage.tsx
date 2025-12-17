import { useEffect, useMemo, useState } from 'react';
import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArticleCard } from '@/components/ArticleCard';
import { CategoryBadges } from '@/components/CategoryBadges';
import { PaginatedList } from '@/components/PaginatedList';
import { PageHeader, HeaderButton } from '@/components/PageHeader';
import { apiClient } from '@/api/client';
import { clearUserSession } from '@/lib/auth';
import type { Article, Category } from '@/types/api';

const ARTICLES_PER_PAGE = 6;

export function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [articlesResponse, categoriesResponse] = await Promise.all([
          apiClient.get<Article[]>('/articles?page=1&limit=50'),
          apiClient.get<Category[]>('/categories'),
        ]);

        setArticles(articlesResponse);
        setCategories(categoriesResponse);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os artigos.');
        toast.error('Erro ao carregar artigos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchTerm === '' ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategoryId === null ||
        article.categoryId === selectedCategoryId;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedCategoryId]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleLogout = () => {
    clearUserSession();
    toast.success('Logout realizado.', { description: 'Até breve!' });
    navigate('/');
  };

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
      <main className="px-4 py-5 lg:px-60">
        <div className="flex w-full flex-col">
          {/* Title and Create Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <h2 className="text-foreground text-3xl font-bold">
              Todos os artigos
            </h2>
            <Button
              className="bg-primary text-primary-foreground h-10 rounded-xl px-4 text-sm font-semibold hover:opacity-90"
              asChild
            >
              <Link to="/articles/create">Criar artigo</Link>
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col gap-2 pb-4">
            {/* Category Filters */}
            <div className="px-3 md:px-4">
              <CategoryBadges
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategoryChange}
                allowDeselect={true}
              />
            </div>

            {/* Search Input */}
            <div className="flex w-full flex-col px-4">
              <Input
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-accent text-muted-foreground h-auto rounded-xl border-0 px-4 py-4 text-base font-normal shadow-none placeholder:text-base placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {isLoading && (
            <div className="px-4 py-8">
              <p className="text-muted-foreground text-base">
                Carregando artigos...
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div className="px-4 py-8">
              <p className="text-destructive text-base">{error}</p>
            </div>
          )}

          {/* Articles List with Pagination */}
          {!isLoading && (
            <PaginatedList
              items={filteredArticles}
              itemsPerPage={ARTICLES_PER_PAGE}
              renderItem={(article) => (
                <ArticleCard key={article.id} article={article} />
              )}
              emptyMessage="Nenhum artigo encontrado"
            />
          )}
        </div>
      </main>
    </div>
  );
}
