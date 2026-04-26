"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Edit2,
  Download,
} from "lucide-react";
import { Mascot } from "@/components/mascot";

interface Goal {
  id: string;
  currentWeight: number;
  targetWeight: number;
  targetDate: string;
  fastingMethod: string;
  progress: number;
}

export default function GoalsPage() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchGoal = useCallback(async () => {
    try {
      const response = await fetch("/api/goals");
      if (response.ok) {
        const data = await response.json();
        setGoal(data.goal);
      }
    } catch (error) {
      console.error("Error fetching goal:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  const handleDownloadPlan = async () => {
    try {
      const response = await fetch("/api/goals/plan", { method: "POST" });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "fasting-plan.pdf";
        a.click();
      }
    } catch (error) {
      console.error("Error downloading plan:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5] items-center justify-center">
        <Mascot type="bunny-yoga" size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-[#FFE4EC] hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Mascot type="bunny-yoga" size="sm" />
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
            <Link href="/dashboard/statistics" className="nav-item">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">สถิติ</span>
            </Link>
            <Link href="/dashboard/goals" className="nav-item active">
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#5D4E6D]">เป้าหมายน้ำหนัก</h1>
            <p className="text-sm text-[#8B7B8B]">ติดตามความก้าวหน้าของคุณ</p>
          </div>
          <Button onClick={() => setShowEditForm(!showEditForm)} className="btn-pink">
            <Edit2 className="h-4 w-4 mr-2" />
            แก้ไข
          </Button>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {goal ? (
            <>
              {/* Progress Circle */}
              <Card className="kawaii-card p-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-6">
                    <svg className="w-full h-full" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#FFE4EC"
                        strokeWidth="12"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#FF8FA3"
                        strokeWidth="12"
                        strokeDasharray={`${(goal.progress / 100) * 440} 440`}
                        strokeLinecap="round"
                        style={{ transform: "rotate(-90deg)", transformOrigin: "80px 80px" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-[#5D4E6D]">
                        {goal.progress}%
                      </span>
                      <span className="text-xs text-[#8B7B8B]">ความก้าวหน้า</span>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-sm text-[#8B7B8B] mb-1">น้ำหนักปัจจุบัน</p>
                    <p className="text-3xl font-bold text-[#5D4E6D]">
                      {goal.currentWeight} kg
                    </p>
                  </div>
                </div>
              </Card>

              {/* Goal Details */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="kawaii-card p-6">
                  <p className="text-xs text-[#8B7B8B] font-medium uppercase">น้ำหนักเป้าหมาย</p>
                  <p className="text-2xl font-bold text-[#FF8FA3] mt-2">
                    {goal.targetWeight}
                  </p>
                  <p className="text-xs text-[#8B7B8B] mt-1">กิโลกรัม</p>
                </Card>

                <Card className="kawaii-card p-6">
                  <p className="text-xs text-[#8B7B8B] font-medium uppercase">น้ำหนักที่ต้องลด</p>
                  <p className="text-2xl font-bold text-[#FF8FA3] mt-2">
                    {(goal.currentWeight - goal.targetWeight).toFixed(1)}
                  </p>
                  <p className="text-xs text-[#8B7B8B] mt-1">กิโลกรัม</p>
                </Card>

                <Card className="kawaii-card p-6">
                  <p className="text-xs text-[#8B7B8B] font-medium uppercase">วันเป้าหมาย</p>
                  <p className="text-lg font-bold text-[#5D4E6D] mt-2">
                    {new Date(goal.targetDate).toLocaleDateString("th-TH")}
                  </p>
                  <p className="text-xs text-[#8B7B8B] mt-1">วันที่หมด</p>
                </Card>

                <Card className="kawaii-card p-6">
                  <p className="text-xs text-[#8B7B8B] font-medium uppercase">วิธีอด</p>
                  <p className="text-lg font-bold text-[#5D4E6D] mt-2">
                    {goal.fastingMethod}
                  </p>
                  <p className="text-xs text-[#8B7B8B] mt-1">โปรแกรม</p>
                </Card>
              </div>

              {/* Recommended Methods */}
              <Card className="kawaii-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#5D4E6D]">วิธีการอดอาหารที่แนะนำ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-[#FFE4EC] to-[#FFF5F7] rounded-2xl border-2 border-[#FFB6C1]">
                    <p className="font-semibold text-[#5D4E6D]">16:8 - เริ่มต้น</p>
                    <p className="text-sm text-[#8B7B8B]">
                      อด 16 ชม. กิน 8 ชม. เหมาะสำหรับผู้เริ่มต้น
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-[#FFE4EC] to-[#FFF5F7] rounded-2xl border-2 border-[#FFB6C1]">
                    <p className="font-semibold text-[#5D4E6D]">18:6 - ปานกลาง</p>
                    <p className="text-sm text-[#8B7B8B]">
                      อด 18 ชม. กิน 6 ชม. เหมาะสำหรับระดับกลาง
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-[#FFE4EC] to-[#FFF5F7] rounded-2xl border-2 border-[#FFB6C1]">
                    <p className="font-semibold text-[#5D4E6D]">OMAD - เร่งด่วน</p>
                    <p className="text-sm text-[#8B7B8B]">
                      อด 23 ชม. กิน 1 ชม. เหมาะสำหรับผู้ประสบการณ์
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleDownloadPlan} className="flex-1 btn-pink">
                  <Download className="h-4 w-4 mr-2" />
                  ดาวน์โหลดแผน
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Mascot type="bunny-yoga" size="lg" />
              <p className="mt-4 text-[#8B7B8B]">ยังไม่มีเป้าหมาย กรุณาสร้างเป้าหมายก่อน</p>
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
            <BarChart3 className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px]">สถิติ</span>
          </Link>
          <Link href="/dashboard/goals" className="flex flex-col items-center gap-1 p-2">
            <Target className="h-5 w-5 text-[#FF8FA3]" />
            <span className="text-[10px]">เป้าหมาย</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
