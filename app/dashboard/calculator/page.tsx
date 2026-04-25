"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calculator, Flame, Target, Info, TrendingDown, Calendar, Clock, Utensils, Play, CheckCircle2, Trash2, ChevronRight, Sparkles, Heart } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Mascot } from "@/components/mascot";

interface WeightLossGoal {
  id: string;
  currentWeight: number;
  targetWeight: number;
  timeframeWeeks: number;
  weightLossPerWeek: number;
  dailyCalorieTarget: number;
  calorieDeficit: number;
  recommendedMethod: string;
  isActive: boolean;
  startDate: string;
  completedDate?: string;
  createdAt: string;
}

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
type Goal = "lose" | "maintain" | "gain";
type FastingMethod = "OMAD" | "Warrior" | "16:8" | "18:6" | "20:4";

interface CalorieResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
}

interface WeightLossGoalResults {
  weeksNeeded: number;
  weightLossPerWeek: number;
  dailyCalorieTarget: number;
  calorieDeficit: number;
  recommendedMethod: FastingMethod;
  methodDescription: string;
  mealsPerDay: number;
  eatingWindow: string;
}

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little to no exercise)",
  light: "Lightly Active (1-3 days/week)",
  moderate: "Moderately Active (3-5 days/week)",
  active: "Very Active (6-7 days/week)",
  very_active: "Extremely Active (physical job + exercise)",
};

export default function CalculatorPage() {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [results, setResults] = useState<CalorieResults | null>(null);

  // Weight Loss Goal Calculator States
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [timeframe, setTimeframe] = useState("12"); // weeks
  const [goalResults, setGoalResults] = useState<WeightLossGoalResults | null>(null);
  
  // Saved Goals State
  const [savedGoals, setSavedGoals] = useState<WeightLossGoal[]>([]);
  const [activeGoal, setActiveGoal] = useState<WeightLossGoal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);

  // Load saved goals and latest weight on mount
  useEffect(() => {
    loadGoals();
    loadLatestWeight();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await fetch("/api/goals");
      if (response.ok) {
        const data = await response.json();
        setSavedGoals(data.goals || []);
        const active = data.goals?.find((g: WeightLossGoal) => g.isActive);
        if (active) {
          setActiveGoal(active);
        }
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const loadLatestWeight = async () => {
    try {
      const response = await fetch("/api/weight");
      if (response.ok) {
        const data = await response.json();
        if (data.logs && data.logs.length > 0) {
          const latest = data.logs[0];
          setLatestWeight(latest.weight);
          setCurrentWeight(latest.weight.toString());
        }
      }
    } catch (error) {
      console.error("Error loading weight:", error);
    }
  };

  const saveGoal = async () => {
    if (!goalResults) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentWeight: parseFloat(currentWeight),
          targetWeight: parseFloat(targetWeight),
          timeframeWeeks: parseInt(timeframe),
          weightLossPerWeek: goalResults.weightLossPerWeek,
          dailyCalorieTarget: goalResults.dailyCalorieTarget,
          calorieDeficit: goalResults.calorieDeficit,
          recommendedMethod: goalResults.recommendedMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setActiveGoal(data.goal);
        await loadGoals();
        alert("Goal saved successfully! 🎉");
      }
    } catch (error) {
      console.error("Error saving goal:", error);
      alert("Failed to save goal");
    }
    setIsLoading(false);
  };

  const completeGoal = async (goalId: string) => {
    try {
      const response = await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId,
          isActive: false,
          completedDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await loadGoals();
        setActiveGoal(null);
      }
    } catch (error) {
      console.error("Error completing goal:", error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      const response = await fetch(`/api/goals?id=${goalId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadGoals();
        if (activeGoal?.id === goalId) {
          setActiveGoal(null);
        }
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const startFasting = (method: string) => {
    const modeMap: Record<string, string> = {
      "OMAD": "OMAD",
      "20:4": "WARRIOR",
      "Warrior": "WARRIOR",
    };
    const mode = modeMap[method] || "OMAD";
    router.push(`/dashboard/fasting?mode=${mode}`);
  };

  const calculateProgress = (goal: WeightLossGoal) => {
    if (!latestWeight) return 0;
    const totalToLose = goal.currentWeight - goal.targetWeight;
    const lost = goal.currentWeight - latestWeight;
    const progress = Math.min(100, Math.max(0, (lost / totalToLose) * 100));
    return Math.round(progress);
  };

  const calculateCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if (!w || !h || !a) return;

    // Mifflin-St Jeor Equation for BMR
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // Calculate TDEE
    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

    // Calculate target based on goal
    let targetCalories = tdee;
    if (goal === "lose") {
      targetCalories = tdee - 500; // 500 calorie deficit for ~0.5kg/week loss
    } else if (goal === "gain") {
      targetCalories = tdee + 500; // 500 calorie surplus for ~0.5kg/week gain
    }

    setResults({
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
    });
  };

  const getGoalLabel = () => {
    switch (goal) {
      case "lose":
        return "Weight Loss (-500 cal/day)";
      case "maintain":
        return "Maintenance";
      case "gain":
        return "Weight Gain (+500 cal/day)";
    }
  };

  const calculateWeightLossGoal = () => {
    const cw = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    const weeks = parseInt(timeframe);

    if (!cw || !tw || !weeks || cw <= tw) return;

    const weightToLose = cw - tw; // kg
    const weightLossPerWeek = weightToLose / weeks;
    
    // Calculate TDEE first (using current weight)
    const w = cw;
    const h = parseFloat(height) || 170; // default if not set
    const a = parseInt(age) || 30; // default if not set
    
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }
    
    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);
    
    // 1kg fat = ~7700 calories
    // To lose weightToLose kg in weeks weeks:
    // Daily deficit needed = (weightToLose * 7700) / (weeks * 7)
    const totalCalorieDeficit = weightToLose * 7700;
    const dailyDeficit = Math.round(totalCalorieDeficit / (weeks * 7));
    const dailyCalorieTarget = tdee - dailyDeficit;
    
    // Determine recommended fasting method based on weight loss rate
    let recommendedMethod: FastingMethod;
    let methodDescription: string;
    let mealsPerDay: number;
    let eatingWindow: string;
    
    if (weightLossPerWeek >= 1.0) {
      recommendedMethod = "OMAD";
      methodDescription = "One Meal A Day - Most aggressive, eat all calories in 1 hour";
      mealsPerDay = 1;
      eatingWindow = "1 hour";
    } else if (weightLossPerWeek >= 0.7) {
      recommendedMethod = "20:4";
      methodDescription = "Warrior Diet - Fast 20 hours, eat within 4 hours";
      mealsPerDay = 2;
      eatingWindow = "4 hours";
    } else if (weightLossPerWeek >= 0.5) {
      recommendedMethod = "18:6";
      methodDescription = "Fast 18 hours, eat within 6 hours";
      mealsPerDay = 2;
      eatingWindow = "6 hours";
    } else {
      recommendedMethod = "16:8";
      methodDescription = "Lean Gains - Fast 16 hours, eat within 8 hours";
      mealsPerDay = 3;
      eatingWindow = "8 hours";
    }
    
    setGoalResults({
      weeksNeeded: weeks,
      weightLossPerWeek: Math.round(weightLossPerWeek * 10) / 10,
      dailyCalorieTarget: Math.max(dailyCalorieTarget, 1200), // minimum 1200 calories for safety
      calorieDeficit: dailyDeficit,
      recommendedMethod,
      methodDescription,
      mealsPerDay,
      eatingWindow,
    });
  };

  return (
    <div className="space-y-6">
      {/* Kawaii Header */}
      <div className="text-center py-6 bg-gradient-to-r from-[#FFE4E9] via-[#FFF5F7] to-[#FFE4E9] rounded-3xl border-2 border-[#FFD5E5]">
        <div className="flex justify-center items-center gap-4 mb-2">
          <Mascot type="bunny" size="sm" />
          <div>
            <h1 className="text-3xl font-bold gradient-text-kawaii">Your Wellness Journey</h1>
            <p className="text-[#8B7B8B] mt-1 flex items-center justify-center gap-2">
              <Heart className="h-4 w-4 text-[#FF6B85] fill-[#FF6B85]" />
              Calculate your goals and track your progress
              <Heart className="h-4 w-4 text-[#FF6B85] fill-[#FF6B85]" />
            </p>
          </div>
          <Mascot type="bear" size="sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="kawaii-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#5D4E6D]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8FA3] to-[#FFB4C2] flex items-center justify-center">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              Your Details
            </CardTitle>
            <CardDescription className="text-[#8B7B8B]">
              Enter your information to calculate your calorie needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={(v: Gender) => setGender(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select
                value={activityLevel}
                onValueChange={(v: ActivityLevel) => setActivityLevel(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Goal</Label>
              <Select value={goal} onValueChange={(v: Goal) => setGoal(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={calculateCalories}
              className="w-full kawaii-button h-12 text-lg"
              disabled={!weight || !height || !age}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Calculate ✨
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {results ? (
            <>
              <Card className="kawaii-card border-l-4 border-l-[#FFB4A2]">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg text-[#5D4E6D]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB4A2] to-[#FF8FA3] flex items-center justify-center">
                      <Flame className="h-4 w-4 text-white" />
                    </div>
                    Basal Metabolic Rate (BMR)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-[#FF8FA3]">{results.bmr.toLocaleString()}</p>
                  <p className="text-sm text-[#8B7B8B]">calories/day</p>
                  <p className="text-sm text-[#8B7B8B] mt-2">
                    Calories your body burns at complete rest 💕
                  </p>
                </CardContent>
              </Card>

              <Card className="kawaii-card border-l-4 border-l-[#B8A9C9]">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg text-[#5D4E6D]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B8A9C9] to-[#A899B9] flex items-center justify-center">
                      <Calculator className="h-4 w-4 text-white" />
                    </div>
                    Total Daily Energy Expenditure (TDEE)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-[#B8A9C9]">{results.tdee.toLocaleString()}</p>
                  <p className="text-sm text-[#8B7B8B]">calories/day</p>
                  <p className="text-sm text-[#8B7B8B] mt-2">
                    Calories to maintain your current weight 🌸
                  </p>
                </CardContent>
              </Card>

              <Card className="kawaii-card border-l-4 border-l-[#A8E6CF]">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg text-[#5D4E6D]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A8E6CF] to-[#88D8B0] flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    Target Calories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-[#2D5A4A]">
                    {results.targetCalories.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#8B7B8B]">calories/day</p>
                  <p className="text-sm text-[#8B7B8B] mt-2">{getGoalLabel()} 🎯</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="kawaii-card h-full flex items-center justify-center">
              <CardContent className="text-center p-8">
                <Mascot type="bunny" size="md" />
                <p className="text-[#8B7B8B] mt-4">
                  Enter your details and click Calculate to see your results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Active Goal Progress */}
      {activeGoal && (
        <Card className="kawaii-card border-l-4 border-l-[#FF8FA3] mb-6">
          <CardHeader>
            <CardTitle className="text-[#5D4E6D] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FF8FA3]" />
              Your Active Goal
              <Mascot type="bunny-happy" size="sm" />
            </CardTitle>
            <CardDescription className="text-[#8B7B8B]">
              Started {formatDistanceToNow(new Date(activeGoal.startDate))} ago 💕
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#FFF5F7] rounded-2xl p-3">
                <p className="text-sm text-[#8B7B8B]">From</p>
                <p className="text-xl font-bold text-[#5D4E6D]">{activeGoal.currentWeight} kg</p>
              </div>
              <div className="bg-[#FFE4E9] rounded-2xl p-3">
                <p className="text-sm text-[#8B7B8B]">Current</p>
                <p className="text-xl font-bold text-[#FF8FA3]">{latestWeight || "--"} kg</p>
              </div>
              <div className="bg-[#E8F5E9] rounded-2xl p-3">
                <p className="text-sm text-[#8B7B8B]">Target</p>
                <p className="text-xl font-bold text-[#2D5A4A]">{activeGoal.targetWeight} kg</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8B7B8B]">Progress</span>
                <span className="font-medium text-[#FF8FA3]">{calculateProgress(activeGoal)}% 🎉</span>
              </div>
              <div className="h-4 bg-[#FFE4E9] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF8FA3] to-[#FFB4C2] rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(activeGoal)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E9] rounded-2xl p-3 text-center border-2 border-[#FFD5E5]">
                <p className="text-xs text-[#8B7B8B]">Daily Target</p>
                <p className="text-lg font-bold text-[#FF8FA3]">{activeGoal.dailyCalorieTarget} cal</p>
              </div>
              <div className="bg-gradient-to-br from-[#E8E0F0] to-[#F0E8F5] rounded-2xl p-3 text-center border-2 border-[#D4C4E0]">
                <p className="text-xs text-[#8B7B8B]">Method</p>
                <p className="text-lg font-bold text-[#B8A9C9]">{activeGoal.recommendedMethod}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => startFasting(activeGoal.recommendedMethod)}
                className="flex-1 kawaii-button h-12"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Fasting 🐰
              </Button>
              <Button
                variant="outline"
                onClick={() => completeGoal(activeGoal.id)}
                className="border-[#A8E6CF] text-[#2D5A4A] hover:bg-[#E8F5E9] rounded-2xl"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete 🎉
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight Loss Goal Calculator */}
      <div className="mt-8 pt-8 border-t-2 border-[#FFE4E9]">
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Mascot type="bear" size="sm" />
            <h2 className="text-2xl font-bold text-[#5D4E6D] flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-[#FF8FA3]" />
              Weight Loss Goal Calculator
            </h2>
            <Mascot type="bunny" size="sm" />
          </div>
          <p className="text-[#8B7B8B] mt-1">
            Set your target weight and timeframe to get a personalized fasting plan 💕
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goal Input Form */}
          <Card className="kawaii-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#5D4E6D]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8FA3] to-[#FFB4C2] flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                Your Goal
              </CardTitle>
              <CardDescription className="text-[#8B7B8B]">
                Enter your current weight, target weight, and how quickly you want to reach it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentWeight" className="text-[#5D4E6D]">Current Weight (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="kawaii-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetWeight" className="text-[#5D4E6D]">Target Weight (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    placeholder="60"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="kawaii-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe" className="text-[#5D4E6D]">Timeframe (weeks)</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="kawaii-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 weeks (1 month) 🌸</SelectItem>
                    <SelectItem value="8">8 weeks (2 months) 🌺</SelectItem>
                    <SelectItem value="12">12 weeks (3 months) 💐</SelectItem>
                    <SelectItem value="16">16 weeks (4 months) 🌷</SelectItem>
                    <SelectItem value="20">20 weeks (5 months) 🌹</SelectItem>
                    <SelectItem value="24">24 weeks (6 months) 🌻</SelectItem>
                    <SelectItem value="52">52 weeks (1 year) 🎉</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculateWeightLossGoal}
                className="w-full kawaii-button h-12 text-lg"
                disabled={!currentWeight || !targetWeight || parseFloat(currentWeight) <= parseFloat(targetWeight)}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Calculate My Plan ✨
              </Button>
            </CardContent>
          </Card>

          {/* Goal Results */}
          <div className="space-y-4">
            {goalResults ? (
              <>
                <Card className="kawaii-card border-l-4 border-l-[#A8E6CF]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#5D4E6D] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A8E6CF] to-[#88D8B0] flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-[#2D5A4A]">{goalResults.weeksNeeded} weeks</p>
                    <p className="text-sm text-[#8B7B8B] mt-1">
                      Lose <strong className="text-[#FF8FA3]">{goalResults.weightLossPerWeek} kg/week</strong> to reach your goal 🎯
                    </p>
                  </CardContent>
                </Card>

                <Card className="kawaii-card border-l-4 border-l-[#FFB4A2]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#5D4E6D] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB4A2] to-[#FF8FA3] flex items-center justify-center">
                        <Flame className="h-4 w-4 text-white" />
                      </div>
                      Daily Calorie Target
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-[#FF8FA3]">{goalResults.dailyCalorieTarget.toLocaleString()}</p>
                    <p className="text-sm text-[#8B7B8B] mt-1">
                      calories/day ({goalResults.calorieDeficit} cal deficit) 🔥
                    </p>
                  </CardContent>
                </Card>

                <Card className="kawaii-card border-l-4 border-l-[#B8A9C9]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#5D4E6D] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B8A9C9] to-[#A899B9] flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      Recommended Fasting Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-[#B8A9C9]">{goalResults.recommendedMethod}</p>
                    <p className="text-sm text-[#8B7B8B] mt-1">{goalResults.methodDescription}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-[#8B7B8B]">
                      <span className="flex items-center gap-1 bg-[#FFF5F7] px-3 py-1 rounded-full">
                        <Utensils className="h-4 w-4 text-[#FF8FA3]" />
                        {goalResults.mealsPerDay} meals/day
                      </span>
                      <span className="flex items-center gap-1 bg-[#E8E0F0] px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4 text-[#B8A9C9]" />
                        {goalResults.eatingWindow} eating window
                      </span>
                    </div>
                    <Button
                      onClick={() => startFasting(goalResults.recommendedMethod)}
                      className="w-full mt-4 kawaii-button"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start {goalResults.recommendedMethod} Fast 🐰
                    </Button>
                  </CardContent>
                </Card>

                {/* Save Goal Button */}
                <Button
                  onClick={saveGoal}
                  disabled={isLoading}
                  className="w-full kawaii-button-accent h-12 text-lg"
                >
                  {isLoading ? "Saving... 💕" : "💾 Save This Goal & Track Progress"}
                </Button>
              </>
            ) : (
              <Card className="kawaii-card h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <Mascot type="bunny-eating" size="lg" />
                  <p className="text-[#8B7B8B] mt-4">
                    Enter your weight loss goal to get a personalized fasting plan
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Past Goals History */}
      {savedGoals.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-[#5D4E6D] mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#A8E6CF]" />
            Your Goals History
            <Mascot type="bear-sleepy" size="sm" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedGoals.map((goal) => (
              <Card key={goal.id} className={`kawaii-card ${goal.isActive ? 'border-l-4 border-l-[#FF8FA3]' : 'opacity-75'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-[#5D4E6D]">
                        {goal.currentWeight} kg → {goal.targetWeight} kg
                      </p>
                      <p className="text-sm text-[#8B7B8B]">
                        {goal.recommendedMethod} • {goal.timeframeWeeks} weeks
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {goal.isActive ? (
                        <span className="text-xs bg-gradient-to-r from-[#FF8FA3] to-[#FFB4C2] text-white px-3 py-1 rounded-full">Active 💕</span>
                      ) : goal.completedDate ? (
                        <span className="text-xs bg-gradient-to-r from-[#A8E6CF] to-[#88D8B0] text-white px-3 py-1 rounded-full">Completed 🎉</span>
                      ) : (
                        <span className="text-xs bg-[#E8E0F0] text-[#8B7B8B] px-3 py-1 rounded-full">Inactive</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#8B7B8B]">
                      Started {format(new Date(goal.startDate), "MMM d, yyyy")}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-[#FF8FA3] hover:text-[#FF6B85] hover:bg-[#FFE4E9] rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <Card className="kawaii-card mt-8">
        <CardHeader>
          <CardTitle className="text-[#5D4E6D] flex items-center gap-2">
            <Info className="h-5 w-5 text-[#B8A9C9]" />
            About These Calculations
            <Mascot type="bunny" size="sm" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[#8B7B8B]">
          <p>
            <strong className="text-[#FF8FA3]">BMR (Basal Metabolic Rate):</strong> The number of calories your body
            needs to maintain basic life functions at rest. Calculated using the
            Mifflin-St Jeor equation. 🔥
          </p>
          <p>
            <strong className="text-[#B8A9C9]">TDEE (Total Daily Energy Expenditure):</strong> Your BMR multiplied
            by an activity factor based on your exercise level. This represents the
            calories needed to maintain your current weight. 💜
          </p>
          <p>
            <strong className="text-[#A8E6CF]">Weight Loss Calculation:</strong> Based on the principle that 
            1kg of body fat contains approximately 7,700 calories. To lose weight safely,
            we recommend a moderate calorie deficit of 500-1000 calories per day. 🌿
          </p>
          <p>
            <strong className="text-[#5D4E6D]">Fasting Method Recommendations:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-[#FF8FA3]">OMAD (23:1):</strong> For aggressive weight loss (&gt;1kg/week) 🐰</li>
            <li><strong className="text-[#FFB4A2]">20:4 (Warrior):</strong> For steady weight loss (0.7-1kg/week) 🐻</li>
            <li><strong className="text-[#B8A9C9]">18:6:</strong> For moderate weight loss (0.5-0.7kg/week) 💜</li>
            <li><strong className="text-[#A8E6CF]">16:8:</strong> For gradual weight loss (&lt;0.5kg/week) 🌸</li>
          </ul>
          <p className="text-xs text-[#8B7B8B] mt-4 bg-[#FFF5F7] p-3 rounded-2xl">
            <strong className="text-[#FF8FA3]">Note:</strong> These are estimates. Individual results may vary based on metabolism,
            body composition, and other factors. Consult a healthcare professional
            for personalized advice. Never consume fewer than 1,200 calories per day without medical supervision. 💕
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
