"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, TrendingDown, TrendingUp, Minus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeightLog {
  id: string;
  weight: number;
  date: string;
  notes: string | null;
}

interface WeightStats {
  min: number | null;
  max: number | null;
  avg: number | null;
  totalChange: number;
  firstWeight: number | null;
  latestWeight: number | null;
}

export default function WeightPage() {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [stats, setStats] = useState<WeightStats | null>(null);
  const [newWeight, setNewWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const fetchWeightLogs = useCallback(async () => {
    try {
      const response = await fetch("/api/weight?limit=30");
      if (response.ok) {
        const data = await response.json();
        setWeightLogs(data.weightLogs);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching weight logs:", error);
    }
  }, []);

  useEffect(() => {
    fetchWeightLogs();
  }, [fetchWeightLogs]);

  const addWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    setLoading(true);
    try {
      const response = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: parseFloat(newWeight),
          date: selectedDate,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        setNewWeight("");
        setNotes("");
        await fetchWeightLogs();
      }
    } catch (error) {
      console.error("Error adding weight:", error);
    }
    setLoading(false);
  };

  const deleteWeight = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/weight?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchWeightLogs();
      }
    } catch (error) {
      console.error("Error deleting weight:", error);
    }
  };

  // Prepare chart data (reverse for chronological order)
  const chartData = [...weightLogs].reverse().map((log) => ({
    date: format(new Date(log.date), "MMM dd"),
    weight: log.weight,
    fullDate: log.date,
  }));

  const getChangeIcon = () => {
    if (!stats || stats.totalChange === 0) return <Minus className="h-5 w-5 text-gray-500" />;
    if (stats.totalChange < 0) return <TrendingDown className="h-5 w-5 text-green-500" />;
    return <TrendingUp className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weight Tracking</h1>
        <p className="text-gray-600">Monitor your weight progress over time</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Current</p>
              <p className="text-2xl font-bold">
                {stats.latestWeight ? `${stats.latestWeight.toFixed(1)} kg` : "—"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Starting</p>
              <p className="text-2xl font-bold">
                {stats.firstWeight ? `${stats.firstWeight.toFixed(1)} kg` : "—"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Change</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {stats.totalChange !== 0
                    ? `${Math.abs(stats.totalChange).toFixed(1)} kg`
                    : "—"}
                </p>
                {getChangeIcon()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-2xl font-bold">
                {stats.avg ? `${stats.avg.toFixed(1)} kg` : "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weight Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weight History</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Weight Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Log Weight
          </CardTitle>
          <CardDescription>Record your weight for today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addWeight} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="How are you feeling?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Log Weight"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your last 10 weight logs</CardDescription>
        </CardHeader>
        <CardContent>
          {weightLogs.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No weight entries yet. Log your first weight above!
            </p>
          ) : (
            <div className="space-y-2">
              {weightLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{log.weight.toFixed(1)} kg</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(log.date), "PPP")}
                      {log.notes && ` • ${log.notes}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteWeight(log.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
