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

  // Redirect to Calculator as the main landing page
  redirect("/dashboard/calculator");

  const data = await getDashboardData(session.user.id);

  return (
    <div className="space-y-8">
      {/* Welcome Section - Mobile Optimized */}
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#D4A574]" />
            <span className="text-xs sm:text-sm font-medium text-[#6B5B4F]">Welcome back</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2C1810] leading-tight">Your Wellness Dashboard</h1>
          <p className="text-xs sm:text-sm text-[#6B5B4F] mt-1">Track your progress and stay motivated on your journey</p>
        </div>
      </div>

      {/* Stats Grid - Mobile: 2 cols, Tablet: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="luxury-card touch-manipulation">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#6B5B4F] mb-0.5 sm:mb-1 truncate">Completed Fasts</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#2C1810]">{data.totalSessions}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#2D5A4A] to-[#1B4332] rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card touch-manipulation">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#6B5B4F] mb-0.5 sm:mb-1 truncate">Weight Entries</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#2C1810]">{data.weightLogsCount}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D4A574] to-[#B8935F] rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card touch-manipulation">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#6B5B4F] mb-0.5 sm:mb-1 truncate">Current Weight</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#2C1810]">
                  {data.latestWeight ? `${data.latestWeight.weight.toFixed(1)}` : "—"}
                </p>
                <p className="text-xs text-[#6B5B4F]">kg</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#C9A961] to-[#B89851] rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card touch-manipulation">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#6B5B4F] mb-0.5 sm:mb-1 truncate">Fasting Status</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#2C1810]">
                  {data.activeSession ? "Active" : "Ready"}
                </p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                data.activeSession 
                  ? "bg-gradient-to-br from-[#2D5A4A] to-[#1B4332]" 
                  : "bg-gradient-to-br from-[#E8B4B8] to-[#D4A0A4]"
              }`}>
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="luxury-card touch-manipulation">
          <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-[#2C1810] flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#D4A574]" />
              Fasting Timer
            </CardTitle>
            <CardDescription className="text-[#6B5B4F] text-xs sm:text-sm">
              {data.activeSession
                ? "You have an active fasting session in progress"
                : "Start a new fasting session to begin your journey"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <Link href="/dashboard/fasting" className="block">
              <Button className="w-full h-11 sm:h-12 bg-gradient-to-r from-[#D4A574] to-[#B8935F] hover:from-[#C49464] hover:to-[#A8834F] text-white rounded-full text-sm sm:text-base touch-manipulation">
                {data.activeSession ? "View Timer" : "Start Fasting"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="luxury-card touch-manipulation">
          <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-[#2C1810] flex items-center gap-2 text-base sm:text-lg">
              <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-[#D4A574]" />
              Weight Log
            </CardTitle>
            <CardDescription className="text-[#6B5B4F] text-xs sm:text-sm">
              Track your weight progress and visualize your transformation
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <Link href="/dashboard/weight" className="block">
              <Button 
                variant="outline" 
                className="w-full h-11 sm:h-12 border-2 border-[#D4A574] text-[#D4A574] hover:bg-[#F5E6D3] rounded-full text-sm sm:text-base touch-manipulation"
              >
                Log Weight
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote - Mobile Optimized */}
      <div className="bg-gradient-to-r from-[#F5E6D3] to-[#E8B4B8] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
        <p className="text-sm sm:text-lg font-medium text-[#2C1810] italic">
          &ldquo;The body achieves what the mind believes.&rdquo;
        </p>
        <p className="text-xs sm:text-sm text-[#6B5B4F] mt-1 sm:mt-2">
          Every fast is a step toward the best version of you
        </p>
      </div>
    </div>
  );
}
