"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Mascot } from "@/components/mascot";

type Step = "welcome" | "info" | "fasting" | "notifications" | "ready";

interface OnboardingData {
  name: string;
  goal: string;
  currentWeight: string;
  fastingMethod: string;
  notifications: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [data, setData] = useState<OnboardingData>({
    name: "",
    goal: "60",
    currentWeight: "70",
    fastingMethod: "16:8",
    notifications: true,
  });

  const steps: Step[] = ["welcome", "info", "fasting", "notifications", "ready"];
  const stepIndex = steps.indexOf(currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1]);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1]);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-[#FFE4EC] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF8FA3] to-[#FFB6C1] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-[#8B7B8B] mt-2 text-center">
            ขั้นตอนที่ {stepIndex + 1} จาก {steps.length}
          </p>
        </div>

        <Card className="kawaii-card">
          {/* Welcome Step */}
          {currentStep === "welcome" && (
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="flex justify-center">
                <Mascot type="bunny-happy" size="xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#5D4E6D] mb-3">
                  ยินดีต้อนรับ! 👋
                </h1>
                <p className="text-[#8B7B8B]">
                  ผมชื่อ บันนี่ เตรียมพร้อมเริ่มการเดินทางด้านสุขภาพของคุณ
                </p>
              </div>
            </CardContent>
          )}

          {/* Info Step */}
          {currentStep === "info" && (
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="flex justify-center">
                <Mascot type="bunny" size="lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#5D4E6D] text-center mb-6">
                  ข้อมูลของคุณ
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                      ชื่อ
                    </label>
                    <Input
                      type="text"
                      placeholder="วิจารย์..."
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      className="kawaii-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                      น้ำหนักปัจจุบัน (kg)
                    </label>
                    <Input
                      type="number"
                      placeholder="70"
                      value={data.currentWeight}
                      onChange={(e) =>
                        setData({ ...data, currentWeight: e.target.value })
                      }
                      className="kawaii-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5D4E6D] mb-2">
                      น้ำหนักเป้าหมาย (kg)
                    </label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={data.goal}
                      onChange={(e) => setData({ ...data, goal: e.target.value })}
                      className="kawaii-input"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {/* Fasting Step */}
          {currentStep === "fasting" && (
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="flex justify-center">
                <Mascot type="bunny-yoga" size="lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#5D4E6D] text-center mb-6">
                  เลือกวิธีอด
                </h2>

                <div className="space-y-3">
                  {[
                    { value: "16:8", label: "16:8", desc: "อด 16 ชม. กิน 8 ชม." },
                    { value: "18:6", label: "18:6", desc: "อด 18 ชม. กิน 6 ชม." },
                    { value: "20:4", label: "20:4", desc: "อด 20 ชม. กิน 4 ชม." },
                    { value: "OMAD", label: "OMAD", desc: "อด 23 ชม. กิน 1 ชม." },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() =>
                        setData({ ...data, fastingMethod: method.value })
                      }
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                        data.fastingMethod === method.value
                          ? "border-[#FF8FA3] bg-gradient-to-br from-[#FFE4EC] to-[#FFF5F7]"
                          : "border-[#FFE4EC] bg-white hover:border-[#FFB6C1]"
                      }`}
                    >
                      <p className="font-semibold text-[#5D4E6D]">{method.label}</p>
                      <p className="text-xs text-[#8B7B8B]">{method.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          )}

          {/* Notifications Step */}
          {currentStep === "notifications" && (
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="flex justify-center">
                <Mascot type="bear-clock" size="lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#5D4E6D] text-center mb-6">
                  ชั้นเตือน
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-[#FFE4EC] to-[#FFF5F7] rounded-2xl border-2 border-[#FFB6C1]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#5D4E6D]">
                          การแจ้งเตือน
                        </p>
                        <p className="text-xs text-[#8B7B8B] mt-1">
                          รับการแจ้งเตือนเพื่อติดตามความก้าวหน้า
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={data.notifications}
                        onChange={(e) =>
                          setData({ ...data, notifications: e.target.checked })
                        }
                        className="w-6 h-6 cursor-pointer accent-[#FF8FA3]"
                      />
                    </div>
                  </div>

                  {data.notifications && (
                    <p className="text-xs text-[#8B7B8B] text-center">
                      ✓ คุณจะได้รับการแจ้งเตือนรายวัน
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          )}

          {/* Ready Step */}
          {currentStep === "ready" && (
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="flex justify-center">
                <Mascot type="bunny-eating" size="xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#5D4E6D] mb-3">
                  พร้อมเริ่ม! 🚀
                </h1>
                <p className="text-[#8B7B8B]">
                  ข้อมูลของคุณ: น้ำหนัก {data.currentWeight} kg → {data.goal} kg
                </p>
                <p className="text-[#8B7B8B] mt-2">
                  วิธีอด: {data.fastingMethod}
                </p>
              </div>
            </CardContent>
          )}

          {/* Navigation */}
          <div className="flex gap-3 p-6 border-t border-[#FFE4EC]">
            <Button
              onClick={prevStep}
              disabled={stepIndex === 0}
              variant="outline"
              className="flex-1 border-2 border-[#FFE4EC] hover:bg-[#FFF5F7]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              ย้อนกลับ
            </Button>

            {currentStep === "ready" ? (
              <Button onClick={handleComplete} className="flex-1 btn-pink">
                ไปยัง Dashboard
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={nextStep} className="flex-1 btn-pink">
                ต่อไป
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
