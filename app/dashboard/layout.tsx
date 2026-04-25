import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { LogOut, Clock, Scale, Calculator, Download, Bell, Home, Sparkles } from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";

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
    <div className="min-h-screen bg-[#FFFBF7]">
      {/* Header - Mobile Optimized */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E8DDD4] sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#D4A574] to-[#B8935F] rounded-lg flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-[#2C1810]">Fasting Tracker</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-[#6B5B4F] hidden sm:inline truncate max-w-[150px]">
              {session.user?.name || session.user?.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#E8DDD4] min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start text-[#6B5B4F] hover:text-[#2C1810] hover:bg-[#F5E6D3]">
                <Home className="mr-3 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/fasting">
              <Button variant="ghost" className="w-full justify-start text-[#6B5B4F] hover:text-[#2C1810] hover:bg-[#F5E6D3]">
                <Clock className="mr-3 h-4 w-4" />
                Fasting Timer
              </Button>
            </Link>
            <Link href="/dashboard/weight">
              <Button variant="ghost" className="w-full justify-start text-[#6B5B4F] hover:text-[#2C1810] hover:bg-[#F5E6D3]">
                <Scale className="mr-3 h-4 w-4" />
                Weight Tracking
              </Button>
            </Link>
            <Link href="/dashboard/calculator">
              <Button variant="ghost" className="w-full justify-start text-[#6B5B4F] hover:text-[#2C1810] hover:bg-[#F5E6D3]">
                <Calculator className="mr-3 h-4 w-4" />
                Calorie Calculator
              </Button>
            </Link>
            <Link href="/dashboard/export">
              <Button variant="ghost" className="w-full justify-start text-[#6B5B4F] hover:text-[#2C1810] hover:bg-[#F5E6D3]">
                <Download className="mr-3 h-4 w-4" />
                Export Data
              </Button>
            </Link>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" className="w-full justify-start text-[#6B5B4F] hover:text-[#2C1810] hover:bg-[#F5E6D3]">
                <Bell className="mr-3 h-4 w-4" />
                Notifications
              </Button>
            </Link>
          </nav>

          {/* Pro Banner */}
          <div className="p-4 mt-8">
            <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8B4B8] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#D4A574]" />
                <span className="text-sm font-semibold text-[#2C1810]">Premium</span>
              </div>
              <p className="text-xs text-[#6B5B4F] mb-3">
                Unlock advanced analytics and personalized insights
              </p>
              <Button size="sm" className="w-full bg-[#2C1810] hover:bg-[#3D2820] text-white text-xs">
                Upgrade Now
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation - iPad/Mobile Optimized */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#E8DDD4] z-50 safe-area-pb">
          <div className="flex justify-around items-center py-2 px-1">
            <Link href="/dashboard" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg active:bg-[#F5E6D3]">
              <Home className="h-5 w-5 text-[#6B5B4F]" />
              <span className="text-[10px] text-[#6B5B4F] font-medium">Home</span>
            </Link>
            <Link href="/dashboard/fasting" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg active:bg-[#F5E6D3]">
              <Clock className="h-5 w-5 text-[#6B5B4F]" />
              <span className="text-[10px] text-[#6B5B4F] font-medium">Fast</span>
            </Link>
            <Link href="/dashboard/weight" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg active:bg-[#F5E6D3]">
              <Scale className="h-5 w-5 text-[#6B5B4F]" />
              <span className="text-[10px] text-[#6B5B4F] font-medium">Weight</span>
            </Link>
            <Link href="/dashboard/calculator" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg active:bg-[#F5E6D3]">
              <Calculator className="h-5 w-5 text-[#6B5B4F]" />
              <span className="text-[10px] text-[#6B5B4F] font-medium">Calc</span>
            </Link>
            <Link href="/dashboard/export" className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg active:bg-[#F5E6D3]">
              <Download className="h-5 w-5 text-[#6B5B4F]" />
              <span className="text-[10px] text-[#6B5B4F] font-medium">Export</span>
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
