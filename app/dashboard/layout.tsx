import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { LogOut, Clock, Scale, Calculator, Download, Bell, Home, Sparkles, Heart } from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";
import { Mascot } from "@/components/mascot";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4E9] to-[#FFD5E5]">
      {/* Header - Kawaii Style */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-[#FFE4E9] sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FF8FA3] to-[#FFB4C2] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
              <span className="text-lg">🐰</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-[#5D4E6D]">Fasting Tracker</span>
              <span className="text-[10px] text-[#FF8FA3] -mt-1">Kawaii Wellness 💕</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-[#8B7B8B] hidden sm:inline truncate max-w-[150px]">
              {session.user?.name || session.user?.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Kawaii Style */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm border-r-2 border-[#FFE4E9] min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start text-[#8B7B8B] hover:text-[#FF8FA3] hover:bg-[#FFF5F7] rounded-2xl">
                <Home className="mr-3 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/fasting">
              <Button variant="ghost" className="w-full justify-start text-[#8B7B8B] hover:text-[#FF8FA3] hover:bg-[#FFF5F7] rounded-2xl">
                <Clock className="mr-3 h-4 w-4" />
                Fasting Timer
              </Button>
            </Link>
            <Link href="/dashboard/weight">
              <Button variant="ghost" className="w-full justify-start text-[#8B7B8B] hover:text-[#FF8FA3] hover:bg-[#FFF5F7] rounded-2xl">
                <Scale className="mr-3 h-4 w-4" />
                Weight Tracking
              </Button>
            </Link>
            <Link href="/dashboard/calculator">
              <Button variant="ghost" className="w-full justify-start text-[#8B7B8B] hover:text-[#FF8FA3] hover:bg-[#FFF5F7] rounded-2xl">
                <Calculator className="mr-3 h-4 w-4" />
                Calorie Calculator
              </Button>
            </Link>
            <Link href="/dashboard/export">
              <Button variant="ghost" className="w-full justify-start text-[#8B7B8B] hover:text-[#FF8FA3] hover:bg-[#FFF5F7] rounded-2xl">
                <Download className="mr-3 h-4 w-4" />
                Export Data
              </Button>
            </Link>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" className="w-full justify-start text-[#8B7B8B] hover:text-[#FF8FA3] hover:bg-[#FFF5F7] rounded-2xl">
                <Bell className="mr-3 h-4 w-4" />
                Notifications
              </Button>
            </Link>
          </nav>

          {/* Kawaii Banner */}
          <div className="p-4 mt-4">
            <div className="bg-gradient-to-br from-[#FFE4E9] to-[#FFD5E5] rounded-3xl p-4 border-2 border-[#FFB4C2]">
              <div className="flex items-center justify-center mb-3">
                <Mascot type="bunny-happy" size="md" />
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-[#5D4E6D]">Stay Motivated!</span>
                <p className="text-xs text-[#8B7B8B] mt-1">
                  Every step counts 💕
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation - Kawaii Style */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-[#FFE4E9] z-50 safe-area-pb">
          <div className="flex justify-around items-center py-2 px-1">
            <Link href="/dashboard" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl active:bg-[#FFF5F7]">
              <Home className="h-5 w-5 text-[#FF8FA3]" />
              <span className="text-[10px] text-[#8B7B8B] font-medium">Home</span>
            </Link>
            <Link href="/dashboard/fasting" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl active:bg-[#FFF5F7]">
              <Clock className="h-5 w-5 text-[#FF8FA3]" />
              <span className="text-[10px] text-[#8B7B8B] font-medium">Fast</span>
            </Link>
            <Link href="/dashboard/weight" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl active:bg-[#FFF5F7]">
              <Scale className="h-5 w-5 text-[#FF8FA3]" />
              <span className="text-[10px] text-[#8B7B8B] font-medium">Weight</span>
            </Link>
            <Link href="/dashboard/calculator" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl active:bg-[#FFF5F7]">
              <Calculator className="h-5 w-5 text-[#FF8FA3]" />
              <span className="text-[10px] text-[#8B7B8B] font-medium">Calc</span>
            </Link>
            <Link href="/dashboard/export" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl active:bg-[#FFF5F7]">
              <Download className="h-5 w-5 text-[#FF8FA3]" />
              <span className="text-[10px] text-[#8B7B8B] font-medium">Export</span>
            </Link>
          </div>
        </nav>

        {/* Main Content - Mobile Optimized */}
        <main className="flex-1 p-3 sm:p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
