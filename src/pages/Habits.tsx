import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Habit = {
  name: string;
  subtasks: string[];
  streak?: number;
  status?: "active" | "building";
};

const defaultHabits: Habit[] = [
  { name: "Morning Meditation", subtasks: ["Find a quiet spot", "Set a 10-min timer", "Breathe and focus"], streak: 12, status: "active" },
  { name: "Exercise", subtasks: ["Choose a workout plan", "Schedule 30 minutes", "Prepare workout clothes"], streak: 7, status: "active" },
];

function generateSubtasks(habit: string, mood?: string, time?: string): string[] {
  const h = habit.toLowerCase();

  // Specific: Cleaning / room tidy
  if (h.includes("clean") || h.includes("room") || h.includes("tidy") || h.includes("organize")) {
    const tasks = [
      "5 minutes: Pick up clothes and put them away",
      "10 minutes: Arrange desk and shelves",
      "5 minutes: Throw out trash and recyclables",
      "5 minutes: Quick sweep / wipe surfaces",
      "5 minutes: Final check and put things back in place",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  // Eating / healthy food
  if (h.includes("eat") || h.includes("food") || h.includes("healthy")) {
    const tasks = [
      "10 minutes: Plan a weekly grocery list",
      "30 minutes: Buy groceries (or order ahead)",
      "30 minutes: Cook a simple meal",
      "15 minutes: Eat mindfully",
      "5 minutes: Log servings of fruits & veggies",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  // Exercise
  if (h.includes("exercise") || h.includes("workout") || h.includes("run") || h.includes("gym")) {
    const tasks = [
      "5 minutes: Warm up (light movement)",
      "20-30 minutes: Main workout (strength/cardio)",
      "5-10 minutes: Cool down and stretch",
      "5 minutes: Log workout and hydrate",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  // Meditation
  if (h.includes("meditat") || h.includes("mindful")) {
    const tasks = [
      "1 minute: Get comfortable and settle in",
      "5-10 minutes: Guided or silent meditation",
      "2 minutes: Gentle breathing to finish",
      "2 minutes: Note how you feel",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  // Reading
  if (h.includes("read") || h.includes("book") || h.includes("reading")) {
    const tasks = [
      "5 minutes: Pick reading material and goal (pages/minutes)",
      "25 minutes: Focused reading session",
      "5 minutes: Summarize or note key takeaways",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  // Journaling / writing
  if (h.includes("journal") || h.includes("write")) {
    const tasks = [
      "2 minutes: Choose a short prompt",
      "10 minutes: Write freely",
      "3 minutes: Read and reflect",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  // Generic fallback with short timed steps
  const base = [
    "5 minutes: Define a specific, measurable goal",
    "5 minutes: Pick a daily time or trigger",
    "10 minutes: Prepare any needed resources",
    "5 minutes: Do the first small action",
    "5 minutes: Review and plan the next step",
  ];

  return adaptTasksForMoodAndTime(base, mood, time);
}

function adaptTasksForMoodAndTime(tasks: string[], mood?: string, time?: string) {
  let adapted = tasks.slice();

  if (mood) {
    const m = mood.toLowerCase();
    if (m === "tired") {
      // shorten durations and add a gentle starter
      adapted = adapted.map((t) => t.replace(/\d+\s?-?\s?(minutes|minute|mins|min)/i, (match) => {
        // make durations smaller (5 or 2 minutes)
        if (/\b(30|25|20|15)\b/.test(match)) return "5 minutes";
        return "5 minutes";
      }));
      adapted.unshift("2 minutes: Do a tiny starter to build momentum");
    }
    if (m === "energetic") {
      // allow longer sessions for energetic mood
      adapted = adapted.map((t) => t.replace(/(5 minutes|5-10 minutes)/i, "10 minutes"));
      adapted.unshift("Take advantage of energy: consider extending the main step today");
    }
  }

  if (time) {
    const label = `Schedule at ${time}`;
    // Insert schedule as the second line if there are multiple tasks
    adapted.splice(1, 0, label);
  }

  return adapted;
}

const Habits = () => {
  const STORAGE_KEY = "ai-habit-builder:habits";

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Habit[];
    } catch (e) {
      // ignore parse errors and fallback to defaults
    }
    return defaultHabits;
  });
  const [newHabit, setNewHabit] = useState("");
  const [pendingHabit, setPendingHabit] = useState<string | null>(null);
  const [mood, setMood] = useState<string>("neutral");
  const [scheduledTime, setScheduledTime] = useState<string>("08:00");
  const [showAddForm, setShowAddForm] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function startBuild(name: string) {
    if (!name.trim()) return;
    setPendingHabit(name.trim());
  }

  function cancelBuild() {
    setPendingHabit(null);
    setMood("neutral");
    setScheduledTime("08:00");
    setShowAddForm(false);
  }

  function confirmBuild() {
    if (!pendingHabit) return;
    const subtasks = generateSubtasks(pendingHabit, mood, scheduledTime);
    const habit: Habit = {
      name: pendingHabit,
      subtasks,
      streak: 0,
      status: "building",
    };
    setHabits((s) => [habit, ...s]);
    setNewHabit("");
    cancelBuild();
  }

  useEffect(() => {
    if (showAddForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddForm]);

  // persist habits on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      // ignore storage errors (e.g., quota)
    }
  }, [habits]);

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
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                {(showAddForm || pendingHabit) ? (
                  <div className="flex flex-col sm:flex-row gap-2 items-start">
                    <input
                      ref={inputRef}
                      placeholder="What habit do you want to build?"
                      value={newHabit}
                      onChange={(e) => setNewHabit(e.target.value)}
                      className="input input-bordered w-full sm:w-96 px-3 py-2 rounded-md"
                    />
                    <button
                      className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-md hover:brightness-95"
                      onClick={() => startBuild(newHabit)}
                      aria-label="Start Building Habit"
                    >
                      <Plus className="h-4 w-4" /> Start Building
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Click + to add a new habit</p>
                )}
              </div>

              <div>
                <button
                  className="inline-flex items-center gap-2 bg-transparent border border-border/20 px-3 py-1 rounded-md hover:bg-muted/30"
                  onClick={() => setShowAddForm((s) => !s)}
                  aria-label="Toggle add habit form"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {pendingHabit && (
              <div className="p-4 rounded-md bg-muted/20 border border-border/30">
                <p className="font-medium mb-2">Building: {pendingHabit}</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <label className="text-sm">How are you feeling?</label>
                  <select value={mood} onChange={(e) => setMood(e.target.value)} className="select select-bordered">
                    <option value="energetic">Energetic</option>
                    <option value="neutral">Neutral</option>
                    <option value="tired">Tired</option>
                  </select>

                  <label className="text-sm">Preferred time</label>
                  <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="input input-bordered" />

                  <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={confirmBuild}>Confirm</button>
                    <button className="btn" onClick={cancelBuild}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {habits.map((habit, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{habit.name}</p>
                      <p className="text-sm text-muted-foreground">{habit.streak} day streak</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={habit.status === "active" ? "default" : "secondary"}>
                      {habit.status === "active" ? "Active" : "Building"}
                    </Badge>
                    <button
                      className="text-sm text-primary underline"
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      {expandedIndex === index ? "Hide details" : "View details"}
                    </button>
                  </div>
                </div>

                {expandedIndex === index && (
                  <div className="mt-3 pl-12">
                    <p className="mb-2 font-medium">Sub-tasks</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {habit.subtasks.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Habits;
