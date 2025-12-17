import { useState, useMemo } from 'react';
import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArticleCard } from '@/components/ArticleCard';
import { CategoryBadges } from '@/components/CategoryBadges';
import { PaginatedList } from '@/components/PaginatedList';
import { PageHeader, HeaderButton } from '@/components/PageHeader';
import articlesData from '@/assets/articles.json';

const ARTICLES_PER_PAGE = 6;

export function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredArticles = useMemo(() => {
    return articlesData.filter((article) => {
      const matchesSearch =
        searchTerm === '' ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === null || article.tag === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleLogout = () => {
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
                selectedCategory={selectedCategory}
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

          {/* Articles List with Pagination */}
          <PaginatedList
            items={filteredArticles}
            itemsPerPage={ARTICLES_PER_PAGE}
            renderItem={(article) => (
              <ArticleCard key={article.id} {...article} />
            )}
            emptyMessage="Nenhum artigo encontrado"
          />
        </div>
      </main>
    </div>
  );
}
