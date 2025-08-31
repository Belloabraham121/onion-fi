export function HowItWorks() {
  return (
    <section className="relative py-20 px-6">
      {/* Badge */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300">
          <div className="w-4 h-4 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor" />
            </svg>
          </div>
          CONNECT • DEPOSIT • OPTIMIZE • EARN
        </div>
      </div>

      {/* Main heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">How it Works</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto text-pretty">
          Connect your wallet, deposit assets, and let OnionFi optimize your yields:
        </p>
      </div>

      {/* Process cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Connect Wallet */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <h3 className="text-xl font-semibold mb-4">Connect Wallet</h3>
          <p className="text-gray-400 text-sm mb-8">
            Connect your Web3 wallet to access OnionFi's yield optimization platform.
          </p>

          <div className="relative h-48 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center relative overflow-hidden">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full"></div>

              {/* Wallet icon */}
              <div className="w-12 h-12 flex items-center justify-center text-white relative z-10">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                  <path
                    d="M21 7H3C2.45 7 2 7.45 2 8V16C2 17.1 2.9 18 4 18H20C21.1 18 22 17.1 22 16V8C22 7.45 21.55 7 21 7ZM20 16H4V9H20V16ZM16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10C16.9 10 16 10.9 16 12Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Select Vaults */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <h3 className="text-xl font-semibold mb-4">Select Vaults</h3>
          <p className="text-gray-400 text-sm mb-8">Choose from curated yield vaults across multiple DeFi protocols.</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">U</span>
              </div>
              <span className="text-sm">Uniswap V3 USDC/ETH</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <span className="text-sm">Aave Lending Pool</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">C</span>
              </div>
              <span className="text-sm">Compound Finance</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">Y</span>
              </div>
              <span className="text-sm">Yearn Vault</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">C</span>
              </div>
              <span className="text-sm">Convex Finance</span>
            </div>
          </div>
        </div>

        {/* Auto-Optimize */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <h3 className="text-xl font-semibold mb-4">Auto-Optimize</h3>
          <p className="text-gray-400 text-sm mb-8">
            AI-powered routing finds the best yields and rebalances automatically.
          </p>

          <div className="relative h-48 flex items-center justify-center">
            {/* Optimization visualization */}
            <div className="relative">
              {/* Floating yield indicators */}
              <div className="absolute -top-4 -left-4 flex items-center gap-1 text-green-400 text-xs animate-pulse">
                <span>12.5%</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" />
                </svg>
              </div>
              <div
                className="absolute -top-2 right-6 flex items-center gap-1 text-blue-400 text-xs animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <span>8.7%</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" />
                </svg>
              </div>
              <div
                className="absolute bottom-4 -left-2 flex items-center gap-1 text-purple-400 text-xs animate-pulse"
                style={{ animationDelay: "1s" }}
              >
                <span>15.2%</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" />
                </svg>
              </div>

              {/* Central optimization hub */}
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border border-gray-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H9V9H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9H21ZM5 19V9H19V19H5Z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status indicator at bottom */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">Optimizing yields...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Track Performance */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <h3 className="text-xl font-semibold mb-4">Track Performance</h3>
          <p className="text-gray-400 text-sm mb-8">Monitor your yields, track performance, and withdraw anytime.</p>

          <div className="relative h-48">
            {/* Dashboard mockup */}
            <div className="bg-gray-950 border border-gray-700 rounded-lg h-full overflow-hidden">
              {/* Dashboard header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <span className="text-xs text-gray-400">Portfolio</span>
                <span className="text-xs text-green-400">+24.7%</span>
              </div>

              {/* Performance metrics */}
              <div className="p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Total Value</span>
                  <span className="text-sm text-white">$12,847.32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">APY</span>
                  <span className="text-sm text-green-400">14.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Daily Yield</span>
                  <span className="text-sm text-green-400">+$4.98</span>
                </div>

                {/* Mini chart visualization */}
                <div className="mt-4 h-12 flex items-end gap-1">
                  <div className="w-2 bg-green-400/60 h-4 rounded-sm"></div>
                  <div className="w-2 bg-green-400/80 h-6 rounded-sm"></div>
                  <div className="w-2 bg-green-400 h-8 rounded-sm"></div>
                  <div className="w-2 bg-green-400/70 h-5 rounded-sm"></div>
                  <div className="w-2 bg-green-400 h-10 rounded-sm"></div>
                  <div className="w-2 bg-green-400/90 h-7 rounded-sm"></div>
                  <div className="w-2 bg-green-400 h-12 rounded-sm"></div>
                </div>
              </div>

              {/* Floating performance indicators */}
              <div className="absolute top-8 right-4 w-1 h-1 bg-green-400 rounded-full opacity-60 animate-pulse"></div>
              <div
                className="absolute top-16 right-8 w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse"
                style={{ animationDelay: "0.7s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
