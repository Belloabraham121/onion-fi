export function IntroductionSection() {
  return (
    <div className="max-w-4xl mx-auto text-center mb-16">
      {/* Introduction badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-8">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="text-sm text-gray-300 uppercase tracking-wider">Introduction</span>
      </div>

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-balance">What is OnionFi ?</h2>

      <p className="text-lg md:text-xl text-gray-400 text-pretty">
        An automated DeFi yield routing protocol that maximizes returns across multiple protocols — intelligently
        allocating capital to the highest-yielding opportunities while minimizing risk and gas costs.
      </p>
    </div>
  )
}
