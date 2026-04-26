"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Clock,
  History,
  BarChart3,
  Target,
  User,
  Settings,
  ChevronLeft,
  TrendingDown,
  Flame,
  Award,
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StatEntry {
  date: string;
  weight: number;
  fastingHours: number;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatEntry[]>([]);
  const [avgWeightLoss, setAvgWeightLoss] = useState(0);
  const [totalFastingHours, setTotalFastingHours] = useState(0);
  const [longestFast, setLongestFast] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/statistics");
      if (response.ok) {
        const data = await response.json();
        setStats(data.entries || []);
        setAvgWeightLoss(data.avgWeightLoss || 0);
        setTotalFastingHours(data.totalFastingHours || 0);
        setLongestFast(data.longestFast || 0);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-[#FFE4EC] hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Mascot type="bunny-happy" size="sm" />
            <span className="font-bold text-[#5D4E6D]">Fasting Tracker</span>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="nav-item">
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link href="/dashboard/fasting" className="nav-item">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">อดอาหาร</span>
            </Link>
            <Link href="/dashboard/history" className="nav-item">
              <History className="h-5 w-5" />
              <span className="text-sm font-medium">ประวัติ</span>
            </Link>
            <Link href="/dashboard/statistics" className="nav-item active">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">สถิติ</span>
            </Link>
            <Link href="/dashboard/goals" className="nav-item">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">เป้าหมาย</span>
            </Link>
            <Link href="/dashboard/profile" className="nav-item">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">โปรไฟล์</span>
            </Link>
            <Link href="/dashboard/settings" className="nav-item">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">ตั้งค่า</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard" className="md:hidden">
            <ChevronLeft className="h-6 w-6 text-[#5D4E6D]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#5D4E6D]">สถิติ</h1>
            <p className="text-sm text-[#8B7B8B]">ติดตามความคืบหน้าของคุณ</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="kawaii-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B7B8B] font-medium">ลดน้ำหนักเฉลี่ย/สัปดาห์</p>
                  <p className="text-3xl font-bold text-[#4ADE80] mt-2">
                    {avgWeightLoss.toFixed(2)}
                  </p>
                  <p className="text-xs text-[#8B7B8B] mt-1">กิโลกรัม</p>
                </div>
                <TrendingDown className="h-12 w-12 text-[#4ADE80] opacity-20" />
              </div>
            </Card>

            <Card className="kawaii-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B7B8B] font-medium">รวมชั่วโมงอด</p>
                  <p className="text-3xl font-bold text-[#FF8FA3] mt-2">
                    {totalFastingHours}
                  </p>
                  <p className="text-xs text-[#8B7B8B] mt-1">ชั่วโมง</p>
                </div>
                <Flame className="h-12 w-12 text-[#FF8FA3] opacity-20" />
              </div>
            </Card>

            <Card className="kawaii-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B7B8B] font-medium">ระยะเวลาอดที่ยาวนาน</p>
                  <p className="text-3xl font-bold text-[#6366F1] mt-2">
                    {longestFast}
                  </p>
                  <p className="text-xs text-[#8B7B8B] mt-1">ชั่วโมง</p>
                </div>
                <Award className="h-12 w-12 text-[#6366F1] opacity-20" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          {stats.length > 0 && (
            <>
              {/* Weight Trend */}
              <Card className="kawaii-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#5D4E6D]">แนวโน้มน้ำหนัก</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#FFE4EC" />
                      <XAxis dataKey="date" stroke="#8B7B8B" />
                      <YAxis stroke="#8B7B8B" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFF5F7",
                          border: "2px solid #FFB6C1",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#FF8FA3"
                        strokeWidth={3}
                        name="น้ำหนัก (kg)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Fasting Hours */}
              <Card className="kawaii-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#5D4E6D]">ชั่วโมงอดรายวัน</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#FFE4EC" />
                      <XAxis dataKey="date" stroke="#8B7B8B" />
                      <YAxis stroke="#8B7B8B" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFF5F7",
                          border: "2px solid #FFB6C1",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="fastingHours"
                        fill="#FF8FA3"
                        radius={[8, 8, 0, 0]}
                        name="ชั่วโมงอด"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {/* Empty State */}
          {stats.length === 0 && (
            <div className="text-center py-12">
              <Mascot type="bunny-happy" size="lg" />
              <p className="mt-4 text-[#8B7B8B]">เริ่มอดเพื่อดูสถิติของคุณ</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#FFE4EC] z-50 safe-area-bottom">
        <div className="flex justify-around items-center py-2">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2">
            <Home className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px]">หน้าหลัก</span>
          </Link>
          <Link href="/dashboard/fasting" className="flex flex-col items-center gap-1 p-2">
            <Clock className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px]">อดอาหาร</span>
          </Link>
          <Link href="/dashboard/history" className="flex flex-col items-center gap-1 p-2">
            <History className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px]">ประวัติ</span>
          </Link>
          <Link href="/dashboard/statistics" className="flex flex-col items-center gap-1 p-2">
            <BarChart3 className="h-5 w-5 text-[#FF8FA3]" />
            <span className="text-[10px]">สถิติ</span>
          </Link>
          <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 p-2">
            <User className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px]">โปรไฟล์</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
