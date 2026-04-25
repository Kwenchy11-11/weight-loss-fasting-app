"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Square, History } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

type FastingMode = "OMAD" | "WARRIOR";

interface FastingSession {
  id: string;
  mode: FastingMode;
  startTime: string;
  targetEndTime: string;
  isActive: boolean;
  duration?: number;
  endTime?: string;
}

export default function FastingPage() {
  const [activeSession, setActiveSession] = useState<FastingSession | null>(null);
  const [pastSessions, setPastSessions] = useState<FastingSession[]>([]);
  const [selectedMode, setSelectedMode] = useState<FastingMode>("OMAD");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch("/api/fasting");
      if (response.ok) {
        const data = await response.json();
        setActiveSession(data.activeSession);
        setPastSessions(data.sessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (!activeSession) {
      setTimeLeft("");
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(activeSession.targetEndTime).getTime();
      const start = new Date(activeSession.startTime).getTime();
      const total = target - start;
      const remaining = target - now;

      if (remaining <= 0) {
        setTimeLeft("Fasting complete!");
        setProgress(100);
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
      setProgress(((total - remaining) / total) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const startFasting = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fasting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: selectedMode }),
      });

      if (response.ok) {
        await fetchSessions();
      }
    } catch (error) {
      console.error("Error starting fast:", error);
    }
    setLoading(false);
  };

  const stopFasting = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fasting", {
        method: "PATCH",
      });

      if (response.ok) {
        await fetchSessions();
      }
    } catch (error) {
      console.error("Error stopping fast:", error);
    }
    setLoading(false);
  };

  const getModeLabel = (mode: FastingMode) => {
    return mode === "OMAD" ? "OMAD (23:1)" : "Warrior Diet (20:4)";
  };

  const getModeDescription = (mode: FastingMode) => {
    return mode === "OMAD"
      ? "One Meal A Day - Fast for 23 hours, eat within 1 hour"
      : "Warrior Diet - Fast for 20 hours, eat within 4 hours";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fasting Timer</h1>
        <p className="text-gray-600">Track your intermittent fasting sessions</p>
      </div>

      {/* Active Timer */}
      <Card className={activeSession ? "border-green-500" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {activeSession ? "Active Fast" : "Start New Fast"}
          </CardTitle>
          <CardDescription>
            {activeSession
              ? `${getModeLabel(activeSession.mode)} - Started ${formatDistanceToNow(
                  new Date(activeSession.startTime)
                )} ago`
              : "Choose your fasting mode and start tracking"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!activeSession ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fasting Mode</label>
                <Select
                  value={selectedMode}
                  onValueChange={(value: FastingMode) => setSelectedMode(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OMAD">OMAD (23:1)</SelectItem>
                    <SelectItem value="WARRIOR">Warrior Diet (20:4)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600">
                  {getModeDescription(selectedMode)}
                </p>
              </div>
              <Button
                onClick={startFasting}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Fasting
              </Button>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold font-mono">{timeLeft}</div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600">
                  Target end time: {format(new Date(activeSession.targetEndTime), "PPp")}
                </p>
              </div>
              <Button
                onClick={stopFasting}
                disabled={loading}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                <Square className="mr-2 h-4 w-4" />
                End Fast
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Past Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Sessions
          </CardTitle>
          <CardDescription>Your last 10 completed fasting sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {pastSessions.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No completed fasting sessions yet. Start your first fast above!
            </p>
          ) : (
            <div className="space-y-3">
              {pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{getModeLabel(session.mode)}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(session.startTime), "PP")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {session.duration
                        ? `${Math.floor(session.duration / 60)}h ${session.duration % 60}m`
                        : "—"}
                    </p>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
