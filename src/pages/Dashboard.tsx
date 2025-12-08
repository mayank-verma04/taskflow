import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/Header";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { StatsOverview } from "@/components/board/StatsOverview";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // UPDATED: Get name from metadata
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 -skew-y-2 origin-top-left -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-4xl pb-2 font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {greeting}, {displayName}
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your tasks today.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-2xl font-semibold text-foreground/80">
              {format(new Date(), "EEEE, MMMM do")}
            </p>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <StatsOverview />

        {/* Main Board Area with enhanced styling */}
        <div className="bg-muted/30 border border-border/50 rounded-xl p-4 md:p-6 backdrop-blur-sm min-h-[600px] shadow-sm">
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;