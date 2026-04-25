import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Clock, Scale, TrendingDown, ArrowRight, Sparkles, Target } from "lucide-react";

async function getDashboardData(userId: string) {
  const activeSession = await prisma.fastingSession.findFirst({
    where: {
      userId,
      status: "active",
    },
    orderBy: {
      startTime: "desc",
    },
  });

  const latestWeight = await prisma.weightLog.findFirst({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  const totalSessions = await prisma.fastingSession.count({
    where: {
      userId,
      status: { not: "active" },
    },
  });

  const weightLogsCount = await prisma.weightLog.count({
    where: {
      userId,
    },
  });

  return {
    activeSession,
    latestWeight,
    totalSessions,
    weightLogsCount,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getDashboardData(session.user.id);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-[#D4A574]" />
            <span className="text-sm font-medium text-[#6B5B4F]">Welcome back</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2C1810]">Your Wellness Dashboard</h1>
          <p className="text-[#6B5B4F] mt-1">Track your progress and stay motivated on your journey</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="luxury-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B5B4F] mb-1">Completed Fasts</p>
                <p className="text-3xl font-bold text-[#2C1810]">{data.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#2D5A4A] to-[#1B4332] rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B5B4F] mb-1">Weight Entries</p>
                <p className="text-3xl font-bold text-[#2C1810]">{data.weightLogsCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4A574] to-[#B8935F] rounded-xl flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B5B4F] mb-1">Current Weight</p>
                <p className="text-3xl font-bold text-[#2C1810]">
                  {data.latestWeight ? `${data.latestWeight.weight.toFixed(1)}` : "—"}
                </p>
                <p className="text-xs text-[#6B5B4F]">kg</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#C9A961] to-[#B89851] rounded-xl flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B5B4F] mb-1">Fasting Status</p>
                <p className="text-3xl font-bold text-[#2C1810]">
                  {data.activeSession ? "Active" : "Ready"}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                data.activeSession 
                  ? "bg-gradient-to-br from-[#2D5A4A] to-[#1B4332]" 
                  : "bg-gradient-to-br from-[#E8B4B8] to-[#D4A0A4]"
              }`}>
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="luxury-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#2C1810] flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#D4A574]" />
              Fasting Timer
            </CardTitle>
            <CardDescription className="text-[#6B5B4F]">
              {data.activeSession
                ? "You have an active fasting session in progress"
                : "Start a new fasting session to begin your journey"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/fasting">
              <Button className="w-full bg-gradient-to-r from-[#D4A574] to-[#B8935F] hover:from-[#C49464] hover:to-[#A8834F] text-white rounded-full">
                {data.activeSession ? "View Timer" : "Start Fasting"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#2C1810] flex items-center gap-2">
              <Scale className="h-5 w-5 text-[#D4A574]" />
              Weight Log
            </CardTitle>
            <CardDescription className="text-[#6B5B4F]">
              Track your weight progress and visualize your transformation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/weight">
              <Button 
                variant="outline" 
                className="w-full border-2 border-[#D4A574] text-[#D4A574] hover:bg-[#F5E6D3] rounded-full"
              >
                Log Weight
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-[#F5E6D3] to-[#E8B4B8] rounded-2xl p-6 text-center">
        <p className="text-lg font-medium text-[#2C1810] italic">
          &ldquo;The body achieves what the mind believes.&rdquo;
        </p>
        <p className="text-sm text-[#6B5B4F] mt-2">
          Every fast is a step toward the best version of you
        </p>
      </div>
    </div>
  );
}
