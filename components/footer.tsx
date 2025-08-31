export function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-gray-800">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1200 200" fill="none">
          <defs>
            <pattern
              id="footer-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Large logo name spanning full width */}
        <div className="mb-8">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white/90 tracking-wider">
            ONIONFI
          </h2>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mt-6"></div>
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto text-pretty">
          Automated DeFi Yield Routing. Maximize returns. Minimize risk. Built
          for DeFi.
        </p>

        {/* Footer links */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-8">
          <a href="#" className="hover:text-white transition-colors">
            What Are We
          </a>
          <a href="#" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#" className="hover:text-white transition-colors">
            What We Provide
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Launch App
          </a>
        </div>

        {/* Copyright */}
        <div className="text-gray-600 text-sm">
          © 2024 OnionFi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
