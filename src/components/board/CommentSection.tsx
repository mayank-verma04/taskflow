import { useState, useRef, useEffect } from "react";
import { useComments } from "@/hooks/use-comments";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Send, MessageSquare, Loader2, Trash2 } from "lucide-react";

interface CommentSectionProps {
  taskId: string;
}

export const CommentSection = ({ taskId }: CommentSectionProps) => {
  const { user } = useAuth();
  const { comments, isLoading, addComment, deleteComment } = useComments(taskId);
  const [newComment, setNewComment] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments?.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    addComment.mutate({
      task_id: taskId,
      user_id: user.id,
      content: newComment,
    });
    setNewComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <MessageSquare className="h-4 w-4" />
        Activity
      </div>

      <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted/30">
        <div className="space-y-3">
          {comments?.length === 0 && (
            <p className="text-xs text-center text-muted-foreground py-8">
              No comments yet. Add a note for yourself!
            </p>
          )}
          {comments?.map((comment) => (
            <div 
              key={comment.id} 
              className="group flex gap-2 items-start animate-fade-in"
            >
              <div className="flex-1 bg-background border rounded-lg p-2.5 shadow-sm">
                <div className="text-sm text-foreground break-words leading-relaxed">
                  {comment.content}
                </div>
                <div className="mt-1.5 flex justify-end">
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteComment.mutate(comment.id)}
                disabled={deleteComment.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="relative">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          className="min-h-[2.5rem] max-h-[150px] py-2 pr-10 resize-none"
          rows={1}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={handleSubmit}
          disabled={!newComment.trim() || addComment.isPending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};