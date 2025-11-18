import { MoodCheckIn } from "@/components/MoodCheckIn";
import { HabitBreaker } from "@/components/HabitBreaker";
import { CoachMessage } from "@/components/CoachMessage";
import { SmartSchedule } from "@/components/SmartSchedule";

interface DashboardProps {
  coachPersona: string;
}

const Dashboard = ({ coachPersona }: DashboardProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <MoodCheckIn />
      
      <div className="grid gap-6 md:grid-cols-2">
        <HabitBreaker />
        <div className="space-y-6">
          <CoachMessage persona={coachPersona} />
          <SmartSchedule />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
