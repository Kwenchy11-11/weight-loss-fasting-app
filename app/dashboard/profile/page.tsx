"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Save,
  LogOut,
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import { signOut } from "next-auth/react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  avatar?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData(data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/login" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5] items-center justify-center">
        <Mascot type="bunny" size="lg" />
      </div>
    );
  }

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
            <Link href="/dashboard/profile" className="nav-item active">
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
            <h1 className="text-2xl font-bold text-[#5D4E6D]">โปรไฟล์ของฉัน</h1>
            <p className="text-sm text-[#8B7B8B]">จัดการข้อมูลส่วนตัวของคุณ</p>
          </div>
          <Button
            onClick={() => (isEditing ? handleSave : setIsEditing(true))}
            className="btn-pink"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                บันทึก
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                แก้ไข
              </>
            )}
          </Button>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Avatar Section */}
          <Card className="kawaii-card p-8">
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <Mascot type="bunny" size="xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#5D4E6D] text-center">
                {user?.name || "ผู้ใช้"}
              </h2>
              <p className="text-sm text-[#8B7B8B] text-center mt-2">{user?.email}</p>
            </div>
          </Card>

          {/* Profile Form */}
          <Card className="kawaii-card p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                  ชื่อ
                </label>
                <Input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="kawaii-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                  อีเมล
                </label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  disabled
                  className="kawaii-input bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                    อายุ
                  </label>
                  <Input
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, age: parseInt(e.target.value) })
                    }
                    disabled={!isEditing}
                    className="kawaii-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                    เพศ
                  </label>
                  <select
                    value={formData.gender || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-[#FFE4EC] rounded-2xl text-[#5D4E6D] disabled:bg-gray-50 focus:outline-none focus:border-[#FFB6C1]"
                  >
                    <option value="">เลือก</option>
                    <option value="M">ชาย</option>
                    <option value="F">หญิง</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                    ความสูง (cm)
                  </label>
                  <Input
                    type="number"
                    value={formData.height || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, height: parseFloat(e.target.value) })
                    }
                    disabled={!isEditing}
                    className="kawaii-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                    น้ำหนัก (kg)
                  </label>
                  <Input
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: parseFloat(e.target.value) })
                    }
                    disabled={!isEditing}
                    className="kawaii-input"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Summary */}
          <Card className="kawaii-card p-6">
            <h3 className="font-semibold text-[#5D4E6D] mb-4">สรุปสถิติ</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#FFE4EC] to-[#FFF5F7] rounded-xl">
                <span className="text-[#8B7B8B]">BMI</span>
                <span className="font-bold text-[#5D4E6D]">
                  {user?.height && user?.weight
                    ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#FFE4EC] to-[#FFF5F7] rounded-xl">
                <span className="text-[#8B7B8B]">TDEE (kcal/วัน)</span>
                <span className="font-bold text-[#5D4E6D]">~2,500</span>
              </div>
            </div>
          </Card>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            className="w-full bg-red-100 hover:bg-red-200 text-red-600 border-2 border-red-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            ออกจากระบบ
          </Button>
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
          <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 p-2">
            <User className="h-5 w-5 text-[#FF8FA3]" />
            <span className="text-[10px]">โปรไฟล์</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
