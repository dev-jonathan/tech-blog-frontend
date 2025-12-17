import { useNavigate, useParams } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ArticleForm } from '@/components/ArticleForm';
import { PageHeader, HeaderButton } from '@/components/PageHeader';
import articlesData from '@/assets/articles.json';
import type { ArticleFormData } from '@/schemas/article.schema';

export function EditArticlePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const article = articlesData.find((a) => a.id === Number(id));

  const handleSubmit = (data: ArticleFormData) => {
    // lógica para atualizar o artigo
    navigate(`/articles/${id}`);
  };

  const handleCancel = () => {
    navigate(`/articles/${id}`);
  };

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
        {/* Page Title */}
        <h1 className="text-foreground mb-8 text-3xl font-bold md:text-4xl">
          Editar Artigo
        </h1>

        <ArticleForm
          defaultValues={article}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitButtonText="Salvar Alterações"
        />
      </main>
    </div>
  );
}
