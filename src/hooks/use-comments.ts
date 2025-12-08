import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, Comment, CommentInsert } from "@/lib/supabase";
import { useEffect } from "react";
import { toast } from "sonner";

export const useComments = (taskId: string) => {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!taskId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`comments-${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for INSERT and DELETE
          schema: "public",
          table: "comments",
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newComment = payload.new as Comment;
            queryClient.setQueryData<Comment[]>(["comments", taskId], (old) => {
              if (old?.find((c) => c.id === newComment.id)) return old;
              return [...(old || []), newComment];
            });
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            queryClient.setQueryData<Comment[]>(["comments", taskId], (old) => {
              return old?.filter((c) => c.id !== deletedId);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, queryClient]);

  // Add Comment
  const addComment = useMutation({
    mutationFn: async (comment: CommentInsert) => {
      const { data, error } = await supabase
        .from("comments")
        .insert(comment)
        .select()
        .single();

      if (error) throw error;
      return data as Comment;
    },
    onSuccess: (newComment) => {
      // Instant UI update
      queryClient.setQueryData<Comment[]>(["comments", taskId], (old) => {
        if (old?.find((c) => c.id === newComment.id)) return old;
        return [...(old || []), newComment];
      });
    },
    onError: (error) => {
      toast.error("Failed to add comment: " + error.message);
    },
  });

  // Delete Comment
  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
      return commentId;
    },
    onSuccess: (deletedId) => {
      // Instant UI update
      queryClient.setQueryData<Comment[]>(["comments", taskId], (old) => {
        return old?.filter((c) => c.id !== deletedId);
      });
      toast.success("Comment deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete comment: " + error.message);
    },
  });

  return { comments, isLoading, addComment, deleteComment };
};