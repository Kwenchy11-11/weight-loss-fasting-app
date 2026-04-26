"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
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
  Download,
  Filter,
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import { format } from "date-fns";

interface HistoryEntry {
  id: string;
  type: "weight" | "fasting";
  date: string;
  value?: number;
  unit?: string;
  duration?: number;
  status?: string;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [filterType, setFilterType] = useState<"all" | "weight" | "fasting">(
    "all"
  );
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredEntries = entries.filter((entry) => {
    if (filterType === "all") return true;
    return entry.type === filterType;
  });

  const exportData = async () => {
    try {
      const response = await fetch("/api/export", { method: "POST" });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "history.xlsx";
        a.click();
      }
    } catch (error) {
      console.error("Error exporting:", error);
    }
  };

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
            <Link href="/dashboard/history" className="nav-item active">
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
            <h1 className="text-2xl font-bold text-[#5D4E6D]">ประวัติ</h1>
            <p className="text-sm text-[#8B7B8B]">ดูประวัติการอดและน้ำหนักของคุณ</p>
          </div>
          <Button
            onClick={exportData}
            className="btn-pink"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            ดาวน์โหลด
          </Button>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Filter */}
          <div className="flex gap-2">
            {(["all", "weight", "fasting"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterType === type
                    ? "bg-[#FF8FA3] text-white"
                    : "bg-white border-2 border-[#FFE4EC] text-[#5D4E6D] hover:border-[#FFB6C1]"
                }`}
              >
                <Filter className="h-3 w-3 inline mr-1" />
                {type === "all"
                  ? "ทั้งหมด"
                  : type === "weight"
                    ? "น้ำหนัก"
                    : "อดอาหาร"}
              </button>
            ))}
          </div>

          {/* Entries */}
          <div className="space-y-3">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="p-4 border-2 border-[#FFE4EC] hover:border-[#FFB6C1] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          entry.type === "weight"
                            ? "bg-[#4ADE80]"
                            : "bg-[#FF8FA3]"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-[#5D4E6D]">
                          {entry.type === "weight" ? "น้ำหนัก" : "อดอาหาร"}
                        </div>
                        <div className="text-xs text-[#8B7B8B]">
                          {format(new Date(entry.date), "dd MMM yyyy HH:mm")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#5D4E6D]">
                        {entry.type === "weight"
                          ? `${entry.value} ${entry.unit || "kg"}`
                          : `${entry.duration} ชม.`}
                      </div>
                      {entry.status && (
                        <div className="text-xs text-[#FF8FA3]">{entry.status}</div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Mascot type="bunny" size="lg" />
                <p className="mt-4 text-[#8B7B8B]">ยังไม่มีประวัติ</p>
              </div>
            )}
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
            <Clock className="h-5 w-5 text-[#8B7B8B]" />
            <span className="text-[10px] text-[#8B7B8B]">อดอาหาร</span>
          </Link>
          <Link href="/dashboard/history" className="flex flex-col items-center gap-1 p-2">
            <History className="h-5 w-5 text-[#FF8FA3]" />
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
