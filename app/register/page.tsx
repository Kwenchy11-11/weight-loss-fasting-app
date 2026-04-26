"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Mascot } from "@/components/mascot";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    weight: "",
    height: "",
    goal: "60",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!agreeTerms) {
      setError("กรุณายอมรับเงื่อนไขการใช้บริการ");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          goal: parseFloat(formData.goal),
        }),
      });

      if (response.ok) {
        router.push("/onboarding");
      } else {
        const data = await response.json();
        setError(data.message || "สมัครสมาชิกไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4EC] to-[#FFD5E5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <Mascot type="bunny-happy" size="xl" />
        </div>

        <Card className="kawaii-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#5D4E6D]">
              สร้างบัญชี 🎉
            </CardTitle>
            <CardDescription className="text-[#8B7B8B]">
              เริ่มการเดินทางด้านสุขภาพของคุณ
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#5D4E6D]">ชื่อ</Label>
                <Input
                  id="name"
                  placeholder="วิจารย์ ..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="kawaii-input"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#5D4E6D]">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nicha@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="kawaii-input"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#5D4E6D]">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    calculatePasswordStrength(e.target.value);
                  }}
                  className="kawaii-input"
                  required
                />
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i <= passwordStrength
                          ? passwordStrength <= 2
                            ? "bg-red-400"
                            : passwordStrength === 3
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#5D4E6D]">
                  ยืนยันรหัสผ่าน
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="kawaii-input"
                  required
                />
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-[#5D4E6D] text-sm">
                    น้ำหนัก (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="kawaii-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-[#5D4E6D] text-sm">
                    ความสูง (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    className="kawaii-input"
                    required
                  />
                </div>
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-[#5D4E6D]">น้ำหนักเป้าหมาย (kg)</Label>
                <Input
                  id="goal"
                  type="number"
                  placeholder="60"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  className="kawaii-input"
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-[#FFF5F7] rounded-xl border border-[#FFE4EC]">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#FF8FA3]"
                />
                <label htmlFor="terms" className="text-xs text-[#8B7B8B]">
                  ฉันยอมรับ{" "}
                  <Link href="/terms" className="text-[#FF8FA3] hover:underline">
                    เงื่อนไขการใช้บริการ
                  </Link>
                  {" "}และ{" "}
                  <Link href="/privacy" className="text-[#FF8FA3] hover:underline">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full btn-pink"
                disabled={loading}
              >
                {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#FFE4EC]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#8B7B8B]">หรือ</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-2 border-[#FFE4EC] hover:bg-[#FFF5F7] rounded-2xl h-12"
                onClick={() => window.location.href = "/api/auth/signin/google"}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                สมัครด้วย Google
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-[#FFE4EC] hover:bg-[#FFF5F7] rounded-2xl h-12"
                onClick={() => window.location.href = "/api/auth/signin/facebook"}
              >
                <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                สมัครด้วย Facebook
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-[#8B7B8B]">
              มีบัญชีแล้ว?{" "}
              <Link href="/login" className="text-[#FF8FA3] font-medium hover:underline">
                เข้าสู่ระบบ
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
