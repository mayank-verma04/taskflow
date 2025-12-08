import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { Task } from "@/lib/supabase";
import { BoardColumn } from "./BoardColumn";
import { TaskCard } from "./TaskCard";
import { TaskDialog } from "./TaskDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Circle, Timer, CheckCircle2 } from "lucide-react";

const columns = [
  { id: "todo", title: "To Do", icon: <Circle className="h-4 w-4 text-muted-foreground" /> },
  { id: "in-progress", title: "In Progress", icon: <Timer className="h-4 w-4 text-primary" /> },
  { id: "done", title: "Completed", icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
];

export const KanbanBoard = () => {
  const { tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByColumn = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over for visual feedback
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if dropped on a column
    const newStatus = columns.find((col) => col.id === overId)?.id;
    
    // Or check if dropped on another task
    const overTask = tasks.find((t) => t.id === overId);
    const targetStatus = newStatus || overTask?.status;

    if (targetStatus && targetStatus !== activeTask.status) {
      updateTask.mutate({
        id: activeId,
        updates: { status: targetStatus },
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleAddTask = (status: string) => {
    setSelectedTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col gap-3 min-w-[300px]">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 px-4">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasksByColumn[column.id] || []}
              icon={column.icon}
              onTaskClick={handleTaskClick}
              onAddTask={() => handleAddTask(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="task-card-dragging">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        defaultStatus={defaultStatus}
      />
    </>
  );
};
