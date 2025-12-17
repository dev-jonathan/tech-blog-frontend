import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ArticleForm } from '@/components/ArticleForm';
import { PageHeader, HeaderButton } from '@/components/PageHeader';
import type { ArticleFormData } from '@/schemas/article.schema';

export function CreateArticlePage() {
  const navigate = useNavigate();

  const handleSubmit = (data: ArticleFormData) => {
    // Add logic
    navigate('/articles');
  };

  const handleCancel = () => {
    navigate('/articles');
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
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        {/* Page Title */}
        <h1 className="text-foreground mb-8 text-3xl font-bold md:text-4xl">
          Criar Novo Artigo
        </h1>

        <ArticleForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitButtonText="Publicar Artigo"
        />
      </main>
    </div>
  );
}
