import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Bell, TrendingDown, Calculator, FileSpreadsheet, Apple } from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your Fasting Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            OMAD & Warrior Diet tracker with smart notifications, weight monitoring, 
            and calorie calculations — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <Clock className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fasting Timer</h3>
              <p className="text-gray-600">
                Track OMAD (23:1) and Warrior Diet (20:4) schedules with precision timing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Bell className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
              <p className="text-gray-600">
                Get push notifications when it&apos;s time to start or break your fast.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <TrendingDown className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Weight Tracking</h3>
              <p className="text-gray-600">
                Log your weight daily and visualize your progress with beautiful charts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Calculator className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Calorie Calculator</h3>
              <p className="text-gray-600">
                Calculate your TDEE and BMR to optimize your fasting results.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <FileSpreadsheet className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Export</h3>
              <p className="text-gray-600">
                Export your fasting and weight data to Excel for detailed analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Apple className="h-12 w-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">PWA Ready</h3>
              <p className="text-gray-600">
                Install on your iPhone or Android device for a native app experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of others achieving their health goals through intermittent fasting.
        </p>
        <Link href="/register">
          <Button size="lg">Create Free Account</Button>
        </Link>
      </div>
    </div>
  );
}
