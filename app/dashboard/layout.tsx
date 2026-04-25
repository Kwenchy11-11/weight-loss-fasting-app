import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { LogOut, Clock, Scale, Calculator, Download, Bell, Home } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl">Fasting Tracker</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {session.user?.name || session.user?.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/fasting">
              <Button variant="ghost" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Fasting Timer
              </Button>
            </Link>
            <Link href="/dashboard/weight">
              <Button variant="ghost" className="w-full justify-start">
                <Scale className="mr-2 h-4 w-4" />
                Weight Tracking
              </Button>
            </Link>
            <Link href="/dashboard/calculator">
              <Button variant="ghost" className="w-full justify-start">
                <Calculator className="mr-2 h-4 w-4" />
                Calorie Calculator
              </Button>
            </Link>
            <Link href="/dashboard/export">
              <Button variant="ghost" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </Link>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
          <div className="flex justify-around p-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/fasting">
              <Button variant="ghost" size="sm">
                <Clock className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/weight">
              <Button variant="ghost" size="sm">
                <Scale className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/calculator">
              <Button variant="ghost" size="sm">
                <Calculator className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/export">
              <Button variant="ghost" size="sm">
                <Download className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
