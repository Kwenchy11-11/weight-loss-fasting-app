import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Bell, TrendingDown, Calculator, FileSpreadsheet, Apple, Sparkles } from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Auth session error:", error);
    // Continue without auth - user will see login prompt
  }

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#E8B4B8] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-[#D4A574] rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#2D5A4A] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5E6D3] rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-[#D4A574]" />
              <span className="text-sm font-medium text-[#6B5B4F]">Your Journey to a Better You</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-[#2C1810] mb-6 leading-tight">
              Transform Your Body,{" "}
              <span className="bg-gradient-to-r from-[#2D5A4A] via-[#D4A574] to-[#C9A961] bg-clip-text text-transparent">
                Elevate Your Life
              </span>
            </h1>
            
            <p className="text-xl text-[#6B5B4F] mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover the power of intermittent fasting with our elegant OMAD & Warrior Diet tracker. 
              Smart notifications, beautiful progress tracking, and personalized insights — all wrapped in a 
              luxurious experience designed for the modern woman.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D4A574] to-[#B8935F] hover:from-[#C49464] hover:to-[#A8834F] text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-[#D4A574]/30 transition-all hover:scale-105"
                >
                  Begin Your Journey
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-[#D4A574] text-[#D4A574] hover:bg-[#F5E6D3] px-8 py-6 text-lg rounded-full transition-all"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2C1810] mb-4">Everything You Need</h2>
          <p className="text-lg text-[#6B5B4F] max-w-2xl mx-auto">
            A complete wellness toolkit designed with sophistication and simplicity in mind
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="luxury-card group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#2D5A4A] to-[#1B4332] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#2D5A4A]/20">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C1810] mb-3">Elegant Fasting Timer</h3>
              <p className="text-[#6B5B4F] leading-relaxed">
                Track OMAD (23:1) and Warrior Diet (20:4) with precision timing in a beautifully designed interface.
              </p>
            </CardContent>
          </Card>

          <Card className="luxury-card group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D4A574] to-[#B8935F] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#D4A574]/20">
                <Bell className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C1810] mb-3">Gentle Reminders</h3>
              <p className="text-[#6B5B4F] leading-relaxed">
                Receive elegant push notifications when it&apos;s time to nourish your body after fasting.
              </p>
            </CardContent>
          </Card>

          <Card className="luxury-card group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#C9A961] to-[#B89851] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#C9A961]/20">
                <TrendingDown className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C1810] mb-3">Weight Journey</h3>
              <p className="text-[#6B5B4F] leading-relaxed">
                Log your progress daily and visualize your transformation with stunning charts.
              </p>
            </CardContent>
          </Card>

          <Card className="luxury-card group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#E8B4B8] to-[#D4A0A4] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#E8B4B8]/20">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C1810] mb-3">Smart Calculator</h3>
              <p className="text-[#6B5B4F] leading-relaxed">
                Calculate your TDEE and BMR with personalized recommendations for your goals.
              </p>
            </CardContent>
          </Card>

          <Card className="luxury-card group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8B7355] to-[#6B5344] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#8B7355]/20">
                <FileSpreadsheet className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C1810] mb-3">Data Export</h3>
              <p className="text-[#6B5B4F] leading-relaxed">
                Export your fasting and weight data to Excel for detailed analysis and sharing.
              </p>
            </CardContent>
          </Card>

          <Card className="luxury-card group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#2D5A4A] via-[#4A7C59] to-[#D4A574] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Apple className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C1810] mb-3">App Experience</h3>
              <p className="text-[#6B5B4F] leading-relaxed">
                Install on your iPhone or Android for a seamless, native app experience anywhere.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D5A4A] via-[#3D7A5A] to-[#2D5A4A]"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #D4A574 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, #C9A961 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of women achieving their wellness goals through the art of intermittent fasting.
          </p>
          <Link href="/register">
            <Button 
              size="lg" 
              className="bg-white text-[#2D5A4A] hover:bg-[#F5E6D3] px-10 py-6 text-lg rounded-full shadow-xl transition-all hover:scale-105"
            >
              Start Your Free Journey
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2C1810] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-6 w-6 text-[#D4A574]" />
            <span className="font-bold text-xl">Fasting Tracker</span>
          </div>
          <p className="text-white/60 text-sm">
            Elegant intermittent fasting for the modern woman
          </p>
        </div>
      </footer>
    </div>
  );
}
