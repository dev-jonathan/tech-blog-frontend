import { useState } from 'react';
import { Trash2, CornerDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Comment } from '@/types/api';

interface CommentsSectionProps {
  comments?: Comment[];
  onSubmitComment?: (content: string) => Promise<void> | void;
  onReplyComment?: (parentId: string, content: string) => Promise<void> | void;
  onDeleteComment?: (commentId: string) => Promise<void> | void;
  isSubmitting?: boolean;
  replyingId?: string | null;
  deletingId?: string | null;
  isAuthenticated?: boolean;
  currentUserId?: string | null;
}

export function CommentsSection({
  comments = [],
  onSubmitComment,
  onReplyComment,
  onDeleteComment,
  isSubmitting = false,
  replyingId = null,
  deletingId = null,
  isAuthenticated = true,
  currentUserId = null,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [showReplies, setShowReplies] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const toggleReplies = (commentId: string) => {
    setShowReplies((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      setLocalError('É necessário estar logado para comentar.');
      return;
    }

    setLocalError(null);
    await onSubmitComment?.(newComment.trim());
    setNewComment('');
  };

  const handleSubmitReply = async (commentId: string) => {
    const replyText = replyTexts[commentId] || '';
    if (!replyText.trim()) return;
    if (!isAuthenticated) {
      setLocalError('É necessário estar logado para comentar.');
      return;
    }

    setLocalError(null);
    await onReplyComment?.(commentId, replyText.trim());
    setReplyTexts((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  const handleDelete = async (
    commentId: string,
    authorId: string | undefined
  ) => {
    if (!currentUserId || currentUserId !== authorId) return;
    await onDeleteComment?.(commentId);
  };

  return (
    <div className="border-border border-t pt-8">
      <h2 className="text-foreground mb-6 text-2xl font-bold">Comentários</h2>

      {/* Comment Form */}
      <div className="mb-8">
        <Textarea
          placeholder={
            isAuthenticated ? 'Escreva um comentário...' : 'Entre para comentar'
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-accent text-foreground mb-3 min-h-[120px] resize-none rounded-xl border-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={!isAuthenticated || isSubmitting}
        />
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSubmitComment}
            className="bg-primary text-primary-foreground h-10 rounded-xl px-6 text-sm font-semibold hover:opacity-90"
            disabled={!newComment.trim() || isSubmitting || !isAuthenticated}
          >
            {isSubmitting ? 'Enviando...' : 'Comentar'}
          </Button>
          {!isAuthenticated && (
            <span className="text-muted-foreground text-sm">
              Faça login para participar
            </span>
          )}
          {localError && (
            <span className="text-destructive text-sm">{localError}</span>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <div className="flex gap-3">
                <div className="bg-accent text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {comment.author?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-foreground text-sm font-bold">
                      {comment.author?.name || 'Anônimo'}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-foreground mb-2 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      className="text-muted-foreground flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                      onClick={() =>
                        setActiveReplyId(
                          activeReplyId === comment.id ? null : comment.id
                        )
                      }
                    >
                      <CornerDownRight className="h-3 w-3" />
                      Responder
                    </button>
                    {!!comment.replies?.length && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="text-primary text-xs font-medium transition-opacity hover:opacity-70"
                      >
                        {showReplies.includes(comment.id)
                          ? 'Ocultar respostas'
                          : `Ver mais comentários`}
                      </button>
                    )}
                    {currentUserId === comment.authorId && (
                      <button
                        onClick={() =>
                          handleDelete(comment.id, comment.authorId)
                        }
                        disabled={deletingId === comment.id}
                        className="text-muted-foreground ml-auto flex items-center gap-1 text-xs transition-opacity hover:opacity-70 disabled:opacity-60"
                      >
                        <Trash2 className="h-3 w-3" />
                        {deletingId === comment.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    )}
                  </div>

                  {/* Reply form */}
                  {activeReplyId === comment.id && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="Responder..."
                        value={replyTexts[comment.id] || ''}
                        onChange={(e) =>
                          setReplyTexts((prev) => ({
                            ...prev,
                            [comment.id]: e.target.value,
                          }))
                        }
                        className="bg-accent text-foreground min-h-[90px] rounded-xl border-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={
                          replyingId === comment.id || deletingId === comment.id
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          className="bg-primary text-primary-foreground h-9 rounded-xl px-4 text-xs font-semibold hover:opacity-90"
                          disabled={
                            !replyTexts[comment.id]?.trim() ||
                            replyingId === comment.id ||
                            deletingId === comment.id
                          }
                          onClick={() => handleSubmitReply(comment.id)}
                        >
                          {replyingId === comment.id
                            ? 'Enviando...'
                            : 'Responder'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-foreground h-9 rounded-xl px-4 text-xs font-semibold hover:bg-transparent"
                          onClick={() => setActiveReplyId(null)}
                          disabled={replyingId === comment.id}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {showReplies.includes(comment.id) &&
                comment.replies &&
                comment.replies.length > 0 && (
                  <div className="border-border ml-12 space-y-4 border-l-2 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="bg-accent text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                          {reply.author?.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-foreground text-sm font-bold">
                              {reply.author?.name || 'Anônimo'}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-foreground mb-2 text-sm leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center text-sm">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  );
}
