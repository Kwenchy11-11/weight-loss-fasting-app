"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Flame, Target, Info, TrendingDown, Calendar, Clock, Utensils } from "lucide-react";

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
      <div>
        <h1 className="text-3xl font-bold">Calorie Calculator</h1>
        <p className="text-gray-600">
          Calculate your BMR, TDEE, and daily calorie targets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Your Details
            </CardTitle>
            <CardDescription>
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
              className="w-full"
              disabled={!weight || !height || !age}
            >
              Calculate
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {results ? (
            <>
              <Card className="border-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Basal Metabolic Rate (BMR)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{results.bmr.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">calories/day</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Calories your body burns at complete rest
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-blue-500" />
                    Total Daily Energy Expenditure (TDEE)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{results.tdee.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">calories/day</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Calories to maintain your current weight
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-green-500" />
                    Target Calories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {results.targetCalories.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">calories/day</p>
                  <p className="text-sm text-gray-600 mt-2">{getGoalLabel()}</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center p-8">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Enter your details and click Calculate to see your results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Weight Loss Goal Calculator */}
      <div className="mt-8 pt-8 border-t border-[#E8DDD4]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#2C1810] flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-[#D4A574]" />
            Weight Loss Goal Calculator
          </h2>
          <p className="text-[#6B5B4F] mt-1">
            Set your target weight and timeframe to get a personalized fasting plan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goal Input Form */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2C1810]">
                <Target className="h-5 w-5 text-[#D4A574]" />
                Your Goal
              </CardTitle>
              <CardDescription className="text-[#6B5B4F]">
                Enter your current weight, target weight, and how quickly you want to reach it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentWeight" className="text-[#2C1810]">Current Weight (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="border-[#E8DDD4]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetWeight" className="text-[#2C1810]">Target Weight (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    placeholder="60"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="border-[#E8DDD4]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe" className="text-[#2C1810]">Timeframe (weeks)</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="border-[#E8DDD4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 weeks (1 month)</SelectItem>
                    <SelectItem value="8">8 weeks (2 months)</SelectItem>
                    <SelectItem value="12">12 weeks (3 months)</SelectItem>
                    <SelectItem value="16">16 weeks (4 months)</SelectItem>
                    <SelectItem value="20">20 weeks (5 months)</SelectItem>
                    <SelectItem value="24">24 weeks (6 months)</SelectItem>
                    <SelectItem value="52">52 weeks (1 year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculateWeightLossGoal}
                className="w-full bg-gradient-to-r from-[#D4A574] to-[#B8935F] hover:from-[#C49464] hover:to-[#A8834F] text-white"
                disabled={!currentWeight || !targetWeight || parseFloat(currentWeight) <= parseFloat(targetWeight)}
              >
                Calculate My Plan
              </Button>
            </CardContent>
          </Card>

          {/* Goal Results */}
          <div className="space-y-4">
            {goalResults ? (
              <>
                <Card className="luxury-card border-l-4 border-l-[#2D5A4A]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#2C1810] flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#2D5A4A]" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-[#2C1810]">{goalResults.weeksNeeded} weeks</p>
                    <p className="text-sm text-[#6B5B4F] mt-1">
                      Lose <strong>{goalResults.weightLossPerWeek} kg/week</strong> to reach your goal
                    </p>
                  </CardContent>
                </Card>

                <Card className="luxury-card border-l-4 border-l-[#D4A574]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#2C1810] flex items-center gap-2">
                      <Flame className="h-5 w-5 text-[#D4A574]" />
                      Daily Calorie Target
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-[#2C1810]">{goalResults.dailyCalorieTarget.toLocaleString()}</p>
                    <p className="text-sm text-[#6B5B4F] mt-1">
                      calories/day ({goalResults.calorieDeficit} cal deficit)
                    </p>
                  </CardContent>
                </Card>

                <Card className="luxury-card border-l-4 border-l-[#C9A961]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#2C1810] flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[#C9A961]" />
                      Recommended Fasting Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-[#2C1810]">{goalResults.recommendedMethod}</p>
                    <p className="text-sm text-[#6B5B4F] mt-1">{goalResults.methodDescription}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-[#6B5B4F]">
                      <span className="flex items-center gap-1">
                        <Utensils className="h-4 w-4" />
                        {goalResults.mealsPerDay} meals/day
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {goalResults.eatingWindow} eating window
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="luxury-card h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <Target className="h-12 w-12 text-[#D4A574] mx-auto mb-4" />
                  <p className="text-[#6B5B4F]">
                    Enter your weight loss goal to get a personalized fasting plan
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="luxury-card mt-8">
        <CardHeader>
          <CardTitle className="text-[#2C1810]">About These Calculations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[#6B5B4F]">
          <p>
            <strong className="text-[#2C1810]">BMR (Basal Metabolic Rate):</strong> The number of calories your body
            needs to maintain basic life functions at rest. Calculated using the
            Mifflin-St Jeor equation.
          </p>
          <p>
            <strong className="text-[#2C1810]">TDEE (Total Daily Energy Expenditure):</strong> Your BMR multiplied
            by an activity factor based on your exercise level. This represents the
            calories needed to maintain your current weight.
          </p>
          <p>
            <strong className="text-[#2C1810]">Weight Loss Calculation:</strong> Based on the principle that 
            1kg of body fat contains approximately 7,700 calories. To lose weight safely,
            we recommend a moderate calorie deficit of 500-1000 calories per day.
          </p>
          <p>
            <strong className="text-[#2C1810]">Fasting Method Recommendations:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>OMAD (23:1):</strong> For aggressive weight loss (&gt;1kg/week)</li>
            <li><strong>20:4 (Warrior):</strong> For steady weight loss (0.7-1kg/week)</li>
            <li><strong>18:6:</strong> For moderate weight loss (0.5-0.7kg/week)</li>
            <li><strong>16:8:</strong> For gradual weight loss (&lt;0.5kg/week)</li>
          </ul>
          <p className="text-xs text-[#6B5B4F] mt-4">
            <strong className="text-[#2C1810]">Note:</strong> These are estimates. Individual results may vary based on metabolism,
            body composition, and other factors. Consult a healthcare professional
            for personalized advice. Never consume fewer than 1,200 calories per day without medical supervision.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
