import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, CheckCircle2, Timer } from "lucide-react";

export const StatsOverview = () => {
  const { tasks, isLoading } = useTasks();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-card animate-pulse opacity-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const todoCount = tasks?.filter((t) => t.status === "todo").length || 0;
  const inProgressCount = tasks?.filter((t) => t.status === "in-progress").length || 0;
  const doneCount = tasks?.filter((t) => t.status === "done").length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8 animate-fade-in">
      <Card className="glass-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">To Do</CardTitle>
          <ListTodo className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todoCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Tasks waiting to start</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          <Timer className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Tasks being worked on</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{doneCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Tasks finished</p>
        </CardContent>
      </Card>
    </div>
  );
};