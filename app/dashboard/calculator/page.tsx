"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Droplets,
  TrendingUp,
  Activity,
  StickyNote,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import { formatDistanceToNow } from "date-fns";

interface FastingSession {
  id: string;
  mode: string;
  startTime: string;
  targetEndTime: string;
  status: string;
}

interface WeightLog {
  id: string;
  weight: number;
  date: string;
}

// Circular Progress Component
function CircularProgress({ 
  progress, 
  timeLeft, 
  label 
}: { 
  progress: number; 
  timeLeft: string; 
  label: string;
}) {
  const radius = 90;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={200} height={200} className="transform -rotate-90">
        <defs>
          <linearGradient id="gradientPink" x1="0%" y1="0%" x2="100%" y2="0%">
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
          cx={100}
          cy={100}
        />
        <circle
          stroke="url(#gradientPink)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={100}
          cy={100}
          style={{
            strokeDasharray: circumference + ' ' + circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-[#5D4E6D]">{timeLeft}</span>
        <span className="text-xs text-[#8B7B8B] mt-1">{label}</span>
      </div>
    </div>
  );
}

// Navigation Item
function NavItem({ 
  href, 
  icon: Icon, 
  label, 
  active = false 
}: { 
  href: string; 
  icon: any; 
  label: string; 
  active?: boolean;
}) {
  return (
    <Link href={href}>
      <div className={`nav-item ${active ? 'active' : ''}`}>
        <Icon className="h-5 w-5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
}

// Quick Action Button
function QuickAction({ 
  icon: Icon, 
  label, 
  color = "pink" 
}: { 
  icon: any; 
  label: string; 
  color?: "pink" | "blue" | "green" | "yellow";
}) {
  const colorClasses = {
    pink: "from-[#FFE4EC] to-[#FFF5F7] text-[#FF8FA3]",
    blue: "from-[#E0F2FE] to-[#F0F9FF] text-[#38BDF8]",
    green: "from-[#DCFCE7] to-[#F0FDF4] text-[#4ADE80]",
    yellow: "from-[#FEF3C7] to-[#FFFBEB] text-[#FBBF24]",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-sm`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-xs text-[#8B7B8B]">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeSession, setActiveSession] = useState<FastingSession | null>(null);
  const [latestWeight, setLatestWeight] = useState<WeightLog | null>(null);
  const [targetWeight] = useState(52.0);
  const [timeLeft, setTimeLeft] = useState("16:08:32");
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!activeSession) return;

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

  const fetchDashboardData = async () => {
    try {
      // Fetch active fasting session
      const fastingRes = await fetch("/api/fasting");
      if (fastingRes.ok) {
        const fastingData = await fastingRes.json();
        setActiveSession(fastingData.activeSession);
      }

      // Fetch latest weight
      const weightRes = await fetch("/api/weight");
      if (weightRes.ok) {
        const weightData = await weightRes.json();
        if (weightData.logs && weightData.logs.length > 0) {
          setLatestWeight(weightData.logs[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const endFasting = async () => {
    try {
      const response = await fetch("/api/fasting", { method: "PATCH" });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error ending fast:", error);
    }
  };

  const currentWeight = latestWeight?.weight || 56.4;
  const weightDiff = currentWeight - targetWeight;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-[#FFE4EC] hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Mascot type="bunny" size="sm" />
            <span className="font-bold text-[#5D4E6D]">Fasting Tracker</span>
          </div>

          <nav className="space-y-2">
            <NavItem href="/dashboard" icon={Home} label="Dashboard" active />
            <NavItem href="/dashboard/fasting" icon={Clock} label="Fasting" />
            <NavItem href="/dashboard/history" icon={History} label="History" />
            <NavItem href="/dashboard/statistics" icon={BarChart3} label="Statistics" />
            <NavItem href="/dashboard/goals" icon={Target} label="Goals" />
            <NavItem href="/dashboard/profile" icon={User} label="Profile" />
            <NavItem href="/dashboard/settings" icon={Settings} label="Settings" />
          </nav>
        </div>

        {/* Motivation Card */}
        <div className="mt-auto p-6">
          <div className="bg-gradient-to-br from-[#FFE4EC] to-[#FFF5F7] rounded-3xl p-4 border border-[#FFB6C1]/30">
            <div className="flex justify-center mb-3">
              <Mascot type="bear-clock" size="md" />
            </div>
            <p className="text-sm text-center text-[#5D4E6D] font-medium">
              "ความสำเร็จคือ ผลรวมของความพยายามเล็กๆ ในทุกๆ วัน"
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-[#5D4E6D]">
              Good morning, Nicha!
            </h1>
            <span className="text-2xl">🌸</span>
          </div>
          <p className="text-[#8B7B8B] text-sm">
            ดีใจนะ วันนี้ก็สู้ๆ นะคะ!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="kawaii-card p-6">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-[#5D4E6D] mb-1">กำลังอดอาหาร</h2>
                <p className="text-sm text-[#8B7B8B]">เริ่มต้น 20:00 - วันนี้</p>
              </div>

              <div className="flex justify-center mb-6">
                <CircularProgress 
                  progress={progress} 
                  timeLeft={timeLeft}
                  label="เหลือเวลา"
                />
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={endFasting}
                  className="btn-pink px-8 py-3 text-base font-medium"
                >
                  สิ้นสุดการอด
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4">
              <QuickAction icon={Droplets} label="น้ำ" color="blue" />
              <QuickAction icon={TrendingUp} label="กราฟน้ำหนัก" color="green" />
              <QuickAction icon={Activity} label="วัดน้ำตาล" color="pink" />
              <QuickAction icon={StickyNote} label="โน้ต" color="yellow" />
            </div>

            {/* Today's Tip */}
            <Card className="kawaii-card p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Mascot type="bunny-yoga" size="sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#5D4E6D] mb-1">คำแนะนำวันนี้</h3>
                  <p className="text-sm text-[#8B7B8B]">
                    ดื่มน้ำอย่างน้อย 8 แก้วต่อวัน เพื่อช่วยให้ร่างกายสามารถเผาผลาญไขมันได้ดีขึ้น
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-4">
            {/* Current Weight */}
            <Card className="kawaii-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#8B7B8B]">น้ำหนักปัจจุบัน</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF] flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-[#38BDF8]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#5D4E6D]">
                {currentWeight.toFixed(1)} <span className="text-lg font-normal">kg</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-[#4ADE80]">
                <TrendingUp className="h-4 w-4" />
                <span>ลดลง 1.2 kg</span>
              </div>
            </Card>

            {/* Target Weight */}
            <Card className="kawaii-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#8B7B8B]">เป้าหมายน้ำหนัก</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#FFF5F7] flex items-center justify-center">
                  <Target className="h-4 w-4 text-[#FF8FA3]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#FF8FA3]">
                {targetWeight.toFixed(1)} <span className="text-lg font-normal">kg</span>
              </div>
              <div className="mt-2 text-sm text-[#8B7B8B]">
                เหลืออีก {weightDiff.toFixed(1)} kg
              </div>
              <div className="mt-3 h-2 bg-[#FFE4EC] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF8FA3] to-[#FFB6C1] rounded-full"
                  style={{ width: `${Math.min(100, ((currentWeight - weightDiff) / currentWeight) * 100)}%` }}
                />
              </div>
            </Card>

            {/* Fasting Stats */}
            <Card className="kawaii-card p-4">
              <h3 className="font-semibold text-[#5D4E6D] mb-3">สถิติการอด</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#8B7B8B]">การอดครั้งล่าสุด</span>
                  <span className="text-sm font-medium text-[#5D4E6D]">16 ชม.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#8B7B8B]">จำนวนครั้งทั้งหมด</span>
                  <span className="text-sm font-medium text-[#5D4E6D]">12 ครั้ง</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#8B7B8B]">สตรีคปัจจุบัน</span>
                  <span className="text-sm font-medium text-[#4ADE80]">5 วัน 🔥</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#FFE4EC] z-50 safe-area-bottom">
        <div className="flex justify-around items-center py-2">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2">
            <Home className="h-5 w-5 text-[#FF8FA3]" />
            <span className="text-[10px] text-[#8B7B8B]">หน้าหลัก</span>
          </Link>
          <Link href="/dashboard/fasting" className="flex flex-col items-center gap-1 p-2">
            <Clock className="h-5 w-5 text-[#8B7B8B]" />
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
