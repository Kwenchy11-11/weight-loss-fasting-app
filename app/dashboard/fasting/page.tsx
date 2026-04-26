"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Clock, 
  History, 
  BarChart3, 
  Target, 
  User, 
  Settings,
  ChevronLeft,
  Play,
  Square
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import { formatDistanceToNow, format } from "date-fns";

type FastingMode = "OMAD" | "WARRIOR" | "16:8" | "18:6" | "20:4";

interface FastingSession {
  id: string;
  mode: FastingMode;
  startTime: string;
  targetEndTime: string;
  status: string;
  endTime?: string;
}

// Circular Timer Component
function CircularTimer({ 
  timeLeft, 
  progress,
  isActive 
}: { 
  timeLeft: string; 
  progress: number;
  isActive: boolean;
}) {
  const radius = 100;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={220} height={220} className="transform -rotate-90">
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF8FA3" />
            <stop offset="50%" stopColor="#FFB6C1" />
            <stop offset="100%" stopColor="#FFC0CB" />
          </linearGradient>
        </defs>
        <circle
          stroke="#FFE4EC"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={normalizedRadius}
          cx={110}
          cy={110}
        />
        <circle
          stroke="url(#timerGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={110}
          cy={110}
          style={{
            strokeDasharray: circumference + ' ' + circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 1s linear',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-[#5D4E6D]">{timeLeft}</span>
        <span className="text-sm text-[#8B7B8B] mt-1">
          {isActive ? "เหลือเวลา" : "พร้อมเริ่ม"}
        </span>
      </div>
    </div>
  );
}

// Fasting Plan Option
function FastingPlan({ 
  mode, 
  label, 
  description, 
  selected, 
  onClick 
}: { 
  mode: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
        selected 
          ? 'border-[#FF8FA3] bg-gradient-to-br from-[#FFE4EC] to-[#FFF5F7]' 
          : 'border-[#FFE4EC] bg-white hover:border-[#FFB6C1]'
      }`}
    >
      <div className="font-semibold text-[#5D4E6D] mb-1">{mode}</div>
      <div className="text-xs text-[#8B7B8B]">{label}</div>
      <div className="text-xs text-[#FF8FA3] mt-1">{description}</div>
    </button>
  );
}

// History Item
function HistoryItem({ 
  date, 
  duration, 
  status 
}: { 
  date: string; 
  duration: string; 
  status: string;
}) {
  const statusColors = {
    completed: "text-[#4ADE80]",
    active: "text-[#FF8FA3]",
    broken: "text-[#FB7185]",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-[#FFE4EC]">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-[#4ADE80]' : status === 'active' ? 'bg-[#FF8FA3]' : 'bg-[#FB7185]'}`} />
        <div>
          <div className="text-sm font-medium text-[#5D4E6D]">{date}</div>
          <div className="text-xs text-[#8B7B8B]">{duration}</div>
        </div>
      </div>
      <div className={`text-sm font-medium ${statusColors[status as keyof typeof statusColors] || 'text-[#8B7B8B]'}`}>
        {status === 'completed' ? 'สำเร็จ' : status === 'active' ? 'กำลังอด' : 'หยุดกลางคัน'}
      </div>
    </div>
  );
}

export default function FastingPage() {
  const [activeSession, setActiveSession] = useState<FastingSession | null>(null);
  const [pastSessions, setPastSessions] = useState<FastingSession[]>([]);
  const [selectedMode, setSelectedMode] = useState<FastingMode>("OMAD");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("16:08:32");
  const [progress, setProgress] = useState(65);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch("/api/fasting");
      if (response.ok) {
        const data = await response.json();
        setActiveSession(data.activeSession);
        setPastSessions(data.sessions || []);
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
      setTimeLeft("00:00:00");
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
        setTimeLeft("00:00:00");
        setProgress(100);
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
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
      const response = await fetch("/api/fasting", { method: "PATCH" });
      if (response.ok) {
        await fetchSessions();
      }
    } catch (error) {
      console.error("Error stopping fast:", error);
    }
    setLoading(false);
  };

  const fastingPlans = [
    { mode: "16:8" as FastingMode, label: "เริ่มต้น", description: "อด 16 ชม. กิน 8 ชม." },
    { mode: "18:6" as FastingMode, label: "ปานกลาง", description: "อด 18 ชม. กิน 6 ชม." },
    { mode: "20:4" as FastingMode, label: "เร่งด่วน", description: "อด 20 ชม. กิน 4 ชม." },
    { mode: "OMAD" as FastingMode, label: "เร่งด่วนที่สุด", description: "อด 23 ชม. กิน 1 ชม." },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-[#FFE4EC] hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Mascot type="bunny" size="sm" />
            <span className="font-bold text-[#5D4E6D]">Fasting Tracker</span>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="nav-item">
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link href="/dashboard/fasting" className="nav-item active">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Fasting</span>
            </Link>
            <Link href="/dashboard/history" className="nav-item">
              <History className="h-5 w-5" />
              <span className="text-sm font-medium">History</span>
            </Link>
            <Link href="/dashboard/statistics" className="nav-item">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">Statistics</span>
            </Link>
            <Link href="/dashboard/goals" className="nav-item">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">Goals</span>
            </Link>
            <Link href="/dashboard/profile" className="nav-item">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
            <Link href="/dashboard/settings" className="nav-item">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard" className="md:hidden">
            <ChevronLeft className="h-6 w-6 text-[#5D4E6D]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#5D4E6D]">กำลังอดอาหาร</h1>
            <p className="text-sm text-[#8B7B8B]">
              {activeSession ? "คุณกำลังอดอาหารอยู่" : "เริ่มการอดอาหารของคุณ"}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Timer Card */}
          <Card className="kawaii-card p-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-[#5D4E6D] mb-1">
                {activeSession ? "กำลังอดอาหาร" : "พร้อมเริ่มอด"}
              </h2>
              {activeSession && (
                <p className="text-sm text-[#8B7B8B]">
                  เริ่มต้น {format(new Date(activeSession.startTime), "HH:mm")} - วันนี้
                </p>
              )}
            </div>

            <div className="flex justify-center mb-6">
              <CircularTimer 
                timeLeft={timeLeft}
                progress={progress}
                isActive={!!activeSession}
              />
            </div>

            <div className="flex justify-center">
              {activeSession ? (
                <Button 
                  onClick={stopFasting}
                  disabled={loading}
                  className="btn-pink px-8 py-3 text-base font-medium"
                >
                  <Square className="h-4 w-4 mr-2" />
                  สิ้นสุดการอด
                </Button>
              ) : (
                <Button 
                  onClick={startFasting}
                  disabled={loading}
                  className="btn-pink px-8 py-3 text-base font-medium"
                >
                  <Play className="h-4 w-4 mr-2" />
                  เริ่มอดอาหาร
                </Button>
              )}
            </div>
          </Card>

          {/* Fasting Plans */}
          {!activeSession && (
            <div>
              <h3 className="font-semibold text-[#5D4E6D] mb-3">เลือกแผนการอด</h3>
              <div className="grid grid-cols-2 gap-3">
                {fastingPlans.map((plan) => (
                  <FastingPlan
                    key={plan.mode}
                    mode={plan.mode}
                    label={plan.label}
                    description={plan.description}
                    selected={selectedMode === plan.mode}
                    onClick={() => setSelectedMode(plan.mode)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* History */}
          <div>
            <h3 className="font-semibold text-[#5D4E6D] mb-3">ประวัติการอดอาหาร</h3>
            <div className="space-y-2">
              {pastSessions.slice(0, 5).map((session) => (
                <HistoryItem
                  key={session.id}
                  date={format(new Date(session.startTime), "dd MMM yyyy")}
                  duration={session.endTime 
                    ? `${Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60))} ชม.`
                    : "ไม่ระบุ"
                  }
                  status={session.status}
                />
              ))}
              {pastSessions.length === 0 && (
                <div className="text-center py-8 text-[#8B7B8B]">
                  <Mascot type="bunny" size="md" />
                  <p className="mt-2">ยังไม่มีประวัติการอด</p>
                </div>
              )}
            </div>
          </div>

          {/* Mascot */}
          <div className="flex justify-center">
            <Mascot type="bunny-happy" size="lg" />
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#FFE4EC] z-50 safe-area-bottom">
        <div className="flex justify-around items-center py-2">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2">
            <Home className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px] text-[#8B7B8B]">หน้าหลัก</span>
          </Link>
          <Link href="/dashboard/fasting" className="flex flex-col items-center gap-1 p-2">
            <Clock className="h-5 w-5 text-[#FF8FA3]" />
            <span className="text-[10px] text-[#8B7B8B]">อดอาหาร</span>
          </Link>
          <Link href="/dashboard/history" className="flex flex-col items-center gap-1 p-2">
            <History className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px] text-[#8B7B8B]">ประวัติ</span>
          </Link>
          <Link href="/dashboard/statistics" className="flex flex-col items-center gap-1 p-2">
            <BarChart3 className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px] text-[#8B7B8B]">สถิติ</span>
          </Link>
          <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 p-2">
            <User className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px] text-[#8B7B8B]">โปรไฟล์</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
