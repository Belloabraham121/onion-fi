export function FeatureCards() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {/* Automated Yield Optimization */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Automated Yield</h3>
        <h4 className="text-xl font-semibold text-gray-300 mb-4">Optimization</h4>
      </div>

      {/* Multi-Protocol Integration */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17" />
            <path d="M2 12L12 17L22 12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Multi-Protocol</h3>
        <h4 className="text-xl font-semibold text-gray-300 mb-4">Integration</h4>
      </div>

      {/* Risk Management & Analytics */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM11 6H13V12H17V14H11V6Z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Risk Management &</h3>
        <h4 className="text-xl font-semibold text-gray-300 mb-4">Analytics</h4>
      </div>
    </div>
  )
}
