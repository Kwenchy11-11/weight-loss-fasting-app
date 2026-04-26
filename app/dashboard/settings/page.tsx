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
  Bell,
  Globe,
  Shield,
  Download,
  Trash2,
} from "lucide-react";
import { Mascot } from "@/components/mascot";

interface UserSettings {
  id: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  dailyReminder: boolean;
  language: string;
  theme: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggle = async (key: keyof UserSettings) => {
    if (!settings) return;

    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);

    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: updated[key] }),
      });
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export", { method: "POST" });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "fasting-data.xlsx";
        a.click();
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "คุณแน่ใจหรือไม่? การลบบัญชีไม่สามารถยกเลิกได้"
      )
    ) {
      return;
    }

    try {
      await fetch("/api/user/delete", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5] items-center justify-center">
        <Mascot type="bear" size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-[#FFE4EC] hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Mascot type="bear" size="sm" />
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
            <Link href="/dashboard/goals" className="nav-item">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">เป้าหมาย</span>
            </Link>
            <Link href="/dashboard/profile" className="nav-item">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">โปรไฟล์</span>
            </Link>
            <Link href="/dashboard/settings" className="nav-item active">
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
            <h1 className="text-2xl font-bold text-[#5D4E6D]">ตั้งค่า</h1>
            <p className="text-sm text-[#8B7B8B]">จัดการการตั้งค่าแอปพลิเคชัน</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Notification Settings */}
          <Card className="kawaii-card p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#5D4E6D] flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#FF8FA3]" />
                การแจ้งเตือน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-[#FFF5F7] rounded-xl transition-colors">
                <label className="text-[#5D4E6D] font-medium">
                  Push Notification
                </label>
                <input
                  type="checkbox"
                  checked={settings?.pushNotifications || false}
                  onChange={() => handleToggle("pushNotifications")}
                  className="w-6 h-6 cursor-pointer accent-[#FF8FA3]"
                />
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-[#FFF5F7] rounded-xl transition-colors">
                <label className="text-[#5D4E6D] font-medium">
                  Email Notification
                </label>
                <input
                  type="checkbox"
                  checked={settings?.emailNotifications || false}
                  onChange={() => handleToggle("emailNotifications")}
                  className="w-6 h-6 cursor-pointer accent-[#FF8FA3]"
                />
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-[#FFF5F7] rounded-xl transition-colors">
                <label className="text-[#5D4E6D] font-medium">
                  ส่งเตือนรายวัน
                </label>
                <input
                  type="checkbox"
                  checked={settings?.dailyReminder || false}
                  onChange={() => handleToggle("dailyReminder")}
                  className="w-6 h-6 cursor-pointer accent-[#FF8FA3]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card className="kawaii-card p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#5D4E6D] flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#6366F1]" />
                การแสดงผล
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                  ภาษา
                </label>
                <select
                  value={settings?.language || "th"}
                  onChange={(e) =>
                    setSettings({
                      ...settings!,
                      language: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-[#FFE4EC] rounded-2xl text-[#5D4E6D] focus:outline-none focus:border-[#FFB6C1]"
                >
                  <option value="th">ไทย</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                  ชุดรูปแบบ
                </label>
                <select
                  value={settings?.theme || "light"}
                  onChange={(e) =>
                    setSettings({
                      ...settings!,
                      theme: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-[#FFE4EC] rounded-2xl text-[#5D4E6D] focus:outline-none focus:border-[#FFB6C1]"
                >
                  <option value="light">สว่าง</option>
                  <option value="dark">มืด</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="kawaii-card p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#5D4E6D] flex items-center gap-2">
                <Download className="h-5 w-5 text-[#4ADE80]" />
                จัดการข้อมูล
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleExport}
                className="w-full bg-[#4ADE80] hover:bg-[#22c55e] text-white border-2 border-[#4ADE80]"
              >
                <Download className="h-4 w-4 mr-2" />
                ส่งออกข้อมูล (Excel)
              </Button>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="kawaii-card p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#5D4E6D] flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#6366F1]" />
                ความเป็นส่วนตัวและความปลอดภัย
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/privacy"
                className="block p-3 hover:bg-[#FFF5F7] rounded-xl transition-colors text-[#FF8FA3]"
              >
                นโยบายความเป็นส่วนตัว
              </Link>
              <Link
                href="/terms"
                className="block p-3 hover:bg-[#FFF5F7] rounded-xl transition-colors text-[#FF8FA3]"
              >
                เงื่อนไขการใช้บริการ
              </Link>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="kawaii-card p-6 border-2 border-red-200 bg-red-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                โซนอันตราย
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600 mb-4">
                การลบบัญชีของคุณและข้อมูลทั้งหมดไม่สามารถยกเลิกได้
              </p>
              <Button
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                ลบบัญชี
              </Button>
            </CardContent>
          </Card>
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
          <Link href="/dashboard/settings" className="flex flex-col items-center gap-1 p-2">
            <Settings className="h-5 w-5 text-[#FF8FA3]" />
            <span className="text-[10px]">ตั้งค่า</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
