import { useState } from 'react';
import { Trash2, CornerDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Reply {
  id: number;
  author: string;
  content: string;
  timeAgo: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  timeAgo: string;
  replies: Reply[];
}

interface CommentsSectionProps {
  comments?: Comment[];
}

export function CommentsSection({ comments = [] }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [showReplies, setShowReplies] = useState<number[]>([]);

  const toggleReplies = (commentId: number) => {
    setShowReplies((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Aqui você adicionaria a lógica para salvar o comentário
      setNewComment('');
    }
  };

  return (
    <div className="border-border border-t pt-8">
      <h2 className="text-foreground mb-6 text-2xl font-bold">Comentários</h2>

      {/* Comment Form */}
      <div className="mb-8">
        <Textarea
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-accent text-foreground mb-3 min-h-[120px] resize-none rounded-xl border-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          onClick={handleSubmitComment}
          className="bg-primary text-primary-foreground h-10 rounded-xl px-6 text-sm font-semibold hover:opacity-90"
        >
          Comentar
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <div className="flex gap-3">
                <div className="bg-accent text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {comment.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-foreground text-sm font-bold">
                      {comment.author}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className="text-foreground mb-2 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <button className="text-muted-foreground flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70">
                      <CornerDownRight className="h-3 w-3" />
                      Responder
                    </button>
                    {comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="text-primary text-xs font-medium transition-opacity hover:opacity-70"
                      >
                        {showReplies.includes(comment.id)
                          ? 'Ocultar respostas'
                          : `Ver mais comentários`}
                      </button>
                    )}
                    <button className="text-muted-foreground ml-auto flex items-center gap-1 text-xs transition-opacity hover:opacity-70">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {showReplies.includes(comment.id) &&
                comment.replies.length > 0 && (
                  <div className="border-border ml-12 space-y-4 border-l-2 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="bg-accent text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                          {reply.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-foreground text-sm font-bold">
                              {reply.author}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {reply.timeAgo}
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
