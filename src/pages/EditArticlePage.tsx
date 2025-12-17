import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { ArticleForm } from '@/components/ArticleForm';
import { PageHeader, HeaderButton } from '@/components/PageHeader';
import { apiClient } from '@/api/client';
import { getStoredUser, clearUserSession } from '@/lib/auth';
import type { ArticleFormData } from '@/schemas/article.schema';
import type { Article, Category } from '@/types/api';

export function EditArticlePage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [articleResponse, categoriesResponse] = await Promise.all([
          apiClient.get<Article>(`/articles/${slug}`),
          apiClient.get<Category[]>('/categories'),
        ]);

        setArticle(articleResponse);
        setCategories(categoriesResponse);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar o artigo para edição.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleSubmit = async (data: ArticleFormData) => {
    const user = getStoredUser();
    if (!user) {
      toast.error('Faça login para editar artigos.');
      navigate('/login');
      return;
    }

    if (!article) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        banner: data.banner || undefined,
        userId: user.userId,
      };

      const updatedArticle = await apiClient.patch<Article>(
        `/articles/${article.id}`,
        payload
      );

      toast.success('Artigo atualizado com sucesso!', {
        description: 'As alterações estão no ar.',
      });
      navigate(`/articles/${updatedArticle.slug}`);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível atualizar o artigo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/articles/${slug}`);
  };

  const handleLogout = () => {
    clearUserSession();
    toast.success('Logout realizado.', { description: 'Até breve!' });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-xl font-medium">
          Carregando artigo...
        </p>
      </div>
    );
  }

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
        {/* Page Title */}
        <h1 className="text-foreground mb-8 text-3xl font-bold md:text-4xl">
          Editar Artigo
        </h1>

        <ArticleForm
          categories={categories}
          defaultValues={{
            title: article.title,
            content: article.content,
            banner: article.banner || '',
            categoryId: article.categoryId,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitButtonText="Salvar Alterações"
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
}
