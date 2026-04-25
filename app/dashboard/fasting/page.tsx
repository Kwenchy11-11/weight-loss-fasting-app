"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Square, History, Smartphone, Bell } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

type FastingMode = "OMAD" | "WARRIOR";

interface FastingSession {
  id: string;
  mode: FastingMode;
  startTime: string;
  targetEndTime: string;
  status: string;
  endTime?: string;
}

function FastingTimerContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  
  const [activeSession, setActiveSession] = useState<FastingSession | null>(null);
  const [pastSessions, setPastSessions] = useState<FastingSession[]>([]);
  const [selectedMode, setSelectedMode] = useState<FastingMode>("OMAD");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  // Set mode from URL parameter on mount
  useEffect(() => {
    if (modeParam === "WARRIOR" || modeParam === "OMAD") {
      setSelectedMode(modeParam);
    }
  }, [modeParam]);

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

  // Check for existing timer state and restore wake lock if active
  useEffect(() => {
    if (activeSession && !wakeLock) {
      requestWakeLock();
      
      // Restore timer in service worker
      sendTimerToServiceWorker(
        "START_TIMER",
        activeSession.targetEndTime,
        activeSession.mode === "OMAD" ? "OMAD (23:1)" : "Warrior (20:4)"
      );
    }
  }, [activeSession]);

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

  // Wake Lock to keep screen on during fasting
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isWakeLockSupported, setIsWakeLockSupported] = useState(false);

  useEffect(() => {
    setIsWakeLockSupported("wakeLock" in navigator);
  }, []);

  const requestWakeLock = async () => {
    if (!isWakeLockSupported) return;
    try {
      const lock = await navigator.wakeLock.request("screen");
      setWakeLock(lock);
      
      lock.addEventListener("release", () => {
        setWakeLock(null);
      });
    } catch (err) {
      console.error("Wake Lock error:", err);
    }
  };

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }
  };

  // Send timer state to service worker
  const sendTimerToServiceWorker = (type: "START_TIMER" | "STOP_TIMER", endTime?: string, mode?: string) => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type,
        endTime,
        mode,
      });
    }
  };

  const startFasting = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fasting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: selectedMode }),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchSessions();
        
        // Request wake lock to keep screen on
        await requestWakeLock();
        
        // Send timer to service worker for persistent notification
        if (data.session) {
          sendTimerToServiceWorker(
            "START_TIMER",
            data.session.targetEndTime,
            selectedMode === "OMAD" ? "OMAD (23:1)" : "Warrior (20:4)"
          );
        }
        
        // Request background sync if available
        if ("serviceWorker" in navigator && "SyncManager" in window) {
          const registration = await navigator.serviceWorker.ready;
          try {
            await (registration as any).sync.register("timer-update");
          } catch (err) {
            console.error("Background sync registration failed:", err);
          }
        }
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
        
        // Release wake lock
        releaseWakeLock();
        
        // Stop timer in service worker
        sendTimerToServiceWorker("STOP_TIMER");
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
                
                {/* Status indicators */}
                <div className="flex justify-center gap-4 text-xs text-gray-500">
                  {wakeLock && (
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      <Smartphone className="h-3 w-3" />
                      Screen stays on
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    <Bell className="h-3 w-3" />
                    Timer in notifications
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Keep this page open or check your notifications for timer updates. 
                  The timer will notify you when complete.
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
                      {session.endTime
                        ? (() => {
                            const start = new Date(session.startTime).getTime();
                            const end = new Date(session.endTime).getTime();
                            const duration = Math.floor((end - start) / (1000 * 60));
                            return `${Math.floor(duration / 60)}h ${duration % 60}m`;
                          })()
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

// Main export with Suspense wrapper
export default function FastingPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fasting Timer</h1>
          <p className="text-gray-600">Track your intermittent fasting sessions</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <FastingTimerContent />
    </Suspense>
  );
}
