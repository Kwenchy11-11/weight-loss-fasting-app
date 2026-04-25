"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Flame, Target, Info } from "lucide-react";

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
type Goal = "lose" | "maintain" | "gain";

interface CalorieResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
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

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About These Calculations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-600">
          <p>
            <strong>BMR (Basal Metabolic Rate):</strong> The number of calories your body
            needs to maintain basic life functions at rest. Calculated using the
            Mifflin-St Jeor equation.
          </p>
          <p>
            <strong>TDEE (Total Daily Energy Expenditure):</strong> Your BMR multiplied
            by an activity factor based on your exercise level. This represents the
            calories needed to maintain your current weight.
          </p>
          <p>
            <strong>Target Calories:</strong> Adjusted based on your goal. A 500
            calorie deficit/surplus typically results in about 0.5kg weight change
            per week.
          </p>
          <p className="text-xs text-gray-500">
            Note: These are estimates. Individual results may vary based on metabolism,
            body composition, and other factors. Consult a healthcare professional
            for personalized advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
