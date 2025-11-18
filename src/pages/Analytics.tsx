import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, Award } from "lucide-react";

const Analytics = () => {
  const stats = [
    { label: "Total Habits", value: "12", icon: BarChart3, color: "text-primary" },
    { label: "Completion Rate", value: "87%", icon: TrendingUp, color: "text-secondary" },
    { label: "Current Streak", value: "7 Days", icon: Calendar, color: "text-accent" },
    { label: "Achievements", value: "5", icon: Award, color: "text-warning" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-[var(--shadow-medium)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-[var(--shadow-elevated)] border-border/50">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>Your habit completion over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {[85, 92, 78, 95, 88, 91, 87].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-muted rounded-t-lg relative overflow-hidden" style={{ height: `${value}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary to-accent" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
