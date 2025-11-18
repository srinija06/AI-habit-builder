import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Habits = () => {
  const habits = [
    { name: "Morning Meditation", streak: 12, status: "active" },
    { name: "Exercise", streak: 7, status: "active" },
    { name: "Read for 30 mins", streak: 5, status: "active" },
    { name: "Journal", streak: 3, status: "building" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="shadow-[var(--shadow-elevated)] border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="h-6 w-6 text-secondary" />
            My Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {habits.map((habit, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{habit.name}</p>
                    <p className="text-sm text-muted-foreground">{habit.streak} day streak</p>
                  </div>
                </div>
                <Badge
                  variant={habit.status === "active" ? "default" : "secondary"}
                  className={habit.status === "active" ? "bg-secondary" : ""}
                >
                  {habit.status === "active" ? "Active" : "Building"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Habits;
