export function PartnerLogos() {
  return (
    <div className="max-w-7xl mx-auto mb-20">
      <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 flex-wrap opacity-60">
        {/* Uniswap */}
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 text-pink-500">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.5 16.5c-1.5 1.5-3.5 2.5-5.5 2.5s-4-1-5.5-2.5S4 13 4 11s1-4 2.5-5.5S10 3 12 3s4 1 5.5 2.5S20 9 20 11s-1 4-2.5 5.5z" />
            </svg>
          </div>
          <span className="font-semibold">Uniswap</span>
        </div>

        {/* Aave */}
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 text-purple-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-semibold">Aave</span>
        </div>

        {/* Compound */}
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 text-green-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8M12 8v8" stroke="black" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-semibold">Compound</span>
        </div>

        {/* Curve */}
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 text-blue-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
          <span className="font-semibold">Curve</span>
        </div>

        {/* Yearn */}
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 text-blue-500">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L22 7v10l-10 5L2 17V7l10-5z" />
            </svg>
          </div>
          <span className="font-semibold">Yearn</span>
        </div>

        {/* Convex */}
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 text-orange-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
            </svg>
          </div>
          <span className="font-semibold">Convex</span>
        </div>

        {/* 1inch */}
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 text-red-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-semibold">1inch</span>
        </div>

        {/* Balancer */}
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 text-yellow-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8" cy="8" r="3" />
              <circle cx="16" cy="8" r="3" />
              <circle cx="12" cy="16" r="3" />
            </svg>
          </div>
          <span className="font-semibold">Balancer</span>
        </div>
      </div>
    </div>
  )
}
