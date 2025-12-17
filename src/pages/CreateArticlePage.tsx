import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { ArticleForm } from '@/components/ArticleForm';
import { PageHeader, HeaderButton } from '@/components/PageHeader';
import { apiClient } from '@/api/client';
import { getStoredUser, clearUserSession } from '@/lib/auth';
import type { ArticleFormData } from '@/schemas/article.schema';
import type { Article, Category } from '@/types/api';

export function CreateArticlePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      toast.error('Faça login para criar um artigo.');
      navigate('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<Category[]>('/categories');
        setCategories(response);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar categorias.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleSubmit = async (data: ArticleFormData) => {
    const user = getStoredUser();
    if (!user) {
      toast.error('Faça login para criar um artigo.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        banner: data.banner || undefined,
        authorId: user.userId,
      };

      const createdArticle = await apiClient.post<Article>(
        '/articles',
        payload
      );

      toast.success('Artigo criado com sucesso!', {
        description: 'Seu post já está publicado.',
      });
      navigate(`/articles/${createdArticle.slug}`);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível criar o artigo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/articles');
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
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        {/* Page Title */}
        <h1 className="text-foreground mb-8 text-3xl font-bold md:text-4xl">
          Criar Novo Artigo
        </h1>

        <ArticleForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitButtonText="Publicar Artigo"
          isSubmitting={isSubmitting || isLoadingCategories}
        />
        {isLoadingCategories && (
          <p className="text-muted-foreground mt-4 text-sm">
            Carregando categorias...
          </p>
        )}
      </main>
    </div>
  );
}
