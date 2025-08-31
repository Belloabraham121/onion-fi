import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-black"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-xl font-semibold">OnionFi</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a
          href="#"
          className="text-gray-300 hover:text-white transition-colors"
        >
          What Are We
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white transition-colors"
        >
          How It Works
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white transition-colors"
        >
          What We Provide
        </a>
      </div>
      <Link href="/dashboard">
        <Button
          variant="outline"
          className="bg-white text-black border-white hover:bg-gray-100"
        >
          Launch App
        </Button>
      </Link>
    </nav>
  );
}
