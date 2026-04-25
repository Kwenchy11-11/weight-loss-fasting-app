import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Clock, Scale, TrendingDown, ArrowRight } from "lucide-react";

async function getDashboardData(userId: string) {
  const activeSession = await prisma.fastingSession.findFirst({
    where: {
      userId,
      isActive: true,
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
      isActive: false,
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s your fasting overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Fasts</p>
                <p className="text-3xl font-bold">{data.totalSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weight Entries</p>
                <p className="text-3xl font-bold">{data.weightLogsCount}</p>
              </div>
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Weight</p>
                <p className="text-3xl font-bold">
                  {data.latestWeight ? `${data.latestWeight.weight} kg` : "—"}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fasting Status</p>
                <p className="text-3xl font-bold">
                  {data.activeSession ? "Active" : "Inactive"}
                </p>
              </div>
              <Clock className={`h-8 w-8 ${data.activeSession ? "text-green-600" : "text-gray-400"}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fasting Timer</CardTitle>
            <CardDescription>
              {data.activeSession
                ? "You have an active fasting session"
                : "Start a new fasting session"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/fasting">
              <Button className="w-full">
                {data.activeSession ? "View Timer" : "Start Fasting"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weight Log</CardTitle>
            <CardDescription>Track your weight progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/weight">
              <Button className="w-full" variant="outline">
                Log Weight
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
