import { useEffect, useState } from 'react';
import { Clock, User, LogOut } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { CommentsSection } from '@/components/CommentsSection';
import { PageHeader, HeaderButton } from '@/components/PageHeader';
import { apiClient } from '@/api/client';
import { getStoredUser, clearUserSession } from '@/lib/auth';
import type { Article, Comment as ArticleComment } from '@/types/api';

function flattenComments(comments: ArticleComment[] = []): ArticleComment[] {
  const flat: ArticleComment[] = [];

  const walk = (commentList: ArticleComment[]) => {
    commentList.forEach((comment) => {
      flat.push({ ...comment, replies: comment.replies || [] });
      if (comment.replies?.length) {
        walk(comment.replies);
      }
    });
  };

  walk(comments);
  return flat;
}

function buildCommentsTree(comments: ArticleComment[] = []): ArticleComment[] {
  const byId = new Map<string, ArticleComment>();

  comments.forEach((comment) => {
    byId.set(comment.id, { ...comment, replies: [] });
  });

  const roots: ArticleComment[] = [];

  comments.forEach((comment) => {
    const current = byId.get(comment.id);
    if (!current) return;

    if (comment.parentId && byId.has(comment.parentId)) {
      const parent = byId.get(comment.parentId)!;
      parent.replies = parent.replies || [];
      parent.replies.push(current);
    } else {
      roots.push(current);
    }
  });

  return roots;
}

function addReplyToTree(
  comments: ArticleComment[] = [],
  parentId: string,
  reply: ArticleComment
): ArticleComment[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [reply, ...(comment.replies || [])],
      };
    }

    const childReplies = comment.replies
      ? addReplyToTree(comment.replies, parentId, reply)
      : comment.replies;

    return { ...comment, replies: childReplies };
  });
}

function removeCommentFromTree(
  comments: ArticleComment[] = [],
  commentId: string
): ArticleComment[] {
  return comments
    .filter((comment) => comment.id !== commentId)
    .map((comment) => ({
      ...comment,
      replies: comment.replies
        ? removeCommentFromTree(comment.replies, commentId)
        : comment.replies,
    }));
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const user = getStoredUser();

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<Article>(`/articles/${slug}`);
        const normalizedComments = buildCommentsTree(
          flattenComments(response.comments || [])
        );
        setArticle({ ...response, comments: normalizedComments });
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar este artigo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleLogout = () => {
    clearUserSession();
    toast.success('Logout realizado.', { description: 'Até breve!' });
    navigate('/');
  };

  const handleSubmitComment = async (content: string) => {
    if (!article) return;
    if (!user) {
      toast.error('Você precisa estar logado para comentar.');
      navigate('/login');
      return;
    }

    try {
      setIsSubmittingComment(true);
      const createdComment = await apiClient.post<ArticleComment>('/comments', {
        content,
        articleId: article.id,
        authorId: user.userId,
      });

      const commentWithAuthor: ArticleComment = {
        ...createdComment,
        author: {
          id: user.userId,
          name: user.name,
          email: user.email,
        },
        replies: createdComment.replies || [],
      };

      setArticle((prev) =>
        prev
          ? { ...prev, comments: [commentWithAuthor, ...(prev.comments || [])] }
          : prev
      );
      toast.success('Comentário publicado com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao publicar o comentário.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplyComment = async (parentId: string, content: string) => {
    if (!article) return;
    if (!user) {
      toast.error('Você precisa estar logado para comentar.');
      navigate('/login');
      return;
    }

    try {
      setReplyingId(parentId);
      const createdReply = await apiClient.post<ArticleComment>('/comments', {
        content,
        articleId: article.id,
        authorId: user.userId,
        parentId,
      });

      const replyWithAuthor: ArticleComment = {
        ...createdReply,
        author: {
          id: user.userId,
          name: user.name,
          email: user.email,
        },
        replies: createdReply.replies || [],
      };

      setArticle((prev) =>
        prev
          ? {
              ...prev,
              comments: addReplyToTree(
                prev.comments || [],
                parentId,
                replyWithAuthor
              ),
            }
          : prev
      );
      toast.success('Resposta publicada com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao responder comentário.');
    } finally {
      setReplyingId(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!article) return;
    if (!user) {
      toast.error('Você precisa estar logado para excluir comentários.');
      navigate('/login');
      return;
    }

    try {
      setDeletingId(commentId);
      await apiClient.delete(`/comments/${commentId}?userId=${user.userId}`);

      setArticle((prev) =>
        prev
          ? {
              ...prev,
              comments: removeCommentFromTree(prev.comments || [], commentId),
            }
          : prev
      );
      toast.error('Comentário excluído.', {
        description: 'A ação não pode ser desfeita.',
      });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir comentário.');
    } finally {
      setDeletingId(null);
    }
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

  if (error || !article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-xl font-medium">
          {error || 'Artigo não encontrado'}
        </p>
      </div>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
  );

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
            {article.category?.name || 'Sem categoria'}
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
                Publicado por {article.author?.name || 'Autor desconhecido'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {article.banner && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <img
              src={article.banner}
              alt={article.title}
              className="h-80 w-full object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="320" viewBox="0 0 800 320" fill="none"><rect width="800" height="320" rx="24" fill="%23F5F5F5"/><path d="M240 220L320 140L380 200L460 120L560 220H240Z" stroke="%23999" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="280" cy="120" r="24" fill="%23999"/></svg>';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg mb-12 max-w-none">
          <div className="text-foreground space-y-4 text-base leading-relaxed">
            <p>{article.content}</p>
          </div>
        </article>

        {/* Comments Section */}
        <CommentsSection
          comments={article.comments}
          onSubmitComment={handleSubmitComment}
          onReplyComment={handleReplyComment}
          onDeleteComment={handleDeleteComment}
          isSubmitting={isSubmittingComment}
          replyingId={replyingId}
          deletingId={deletingId}
          isAuthenticated={!!user}
          currentUserId={user?.userId ?? null}
        />
      </main>
    </div>
  );
}
