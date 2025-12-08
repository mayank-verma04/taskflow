import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "@/lib/supabase";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoardColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  icon: React.ReactNode;
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}

const columnStyles = {
  todo: "bg-column-todo",
  "in-progress": "bg-column-progress",
  done: "bg-column-done",
};

export const BoardColumn = ({
  id,
  title,
  tasks,
  icon,
  onTaskClick,
  onAddTask,
}: BoardColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-3 min-w-[300px] max-w-[350px] flex-1">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-sm text-foreground">{title}</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "kanban-column",
          columnStyles[id as keyof typeof columnStyles] || "bg-muted/50",
          isOver && "ring-2 ring-primary/50 ring-inset"
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard task={task} onClick={() => onTaskClick(task)} />
            </div>
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground/50">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
