import { Button } from "@/client/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Vertical light beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white/40 via-white/20 to-transparent animate-pulse"></div>
        <div
          className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-white/30 via-white/15 to-transparent animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-white/35 via-white/18 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-white/25 via-white/12 to-transparent animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Additional scattered light points */}
        <div className="absolute top-20 left-1/5 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
        <div
          className="absolute top-32 right-1/5 w-1 h-1 bg-white/50 rounded-full animate-pulse"
          style={{ animationDelay: "0.8s" }}
        ></div>
        <div
          className="absolute top-48 left-2/3 w-1 h-1 bg-white/40 rounded-full animate-pulse"
          style={{ animationDelay: "1.2s" }}
        ></div>
      </div>

      {/* Curved light streaks */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 blur-3xl"></div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-20">
          <div className="w-full h-full bg-gradient-to-l from-transparent via-white to-transparent transform rotate-45 blur-3xl"></div>
        </div>
      </div>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
        {/* Welcome badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-sm text-gray-300 uppercase tracking-wider">
            Welcome to OnionFi
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-5xl text-balance">
          Automated DeFi
          <br />
          Yield Routing.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl text-pretty">
          Maximize returns. Minimize risk. Built for DeFi.
        </p>

        {/* CTA Button */}
        <Link href="/dashboard">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-medium mb-16"
          >
            Launch App
          </Button>
        </Link>

        {/* App Icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-b from-gray-700 to-gray-900 rounded-2xl border border-gray-600 flex items-center justify-center shadow-2xl">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-black"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl scale-110 -z-10"></div>

          {/* Vertical line extending down */}
          <div className="absolute top-full left-1/2 -translate-x-px w-px h-32 bg-gradient-to-b from-gray-600 to-transparent"></div>
        </div>
      </main>
    </div>
  );
}
