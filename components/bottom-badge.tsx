export function BottomBadge() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800/50 border border-gray-700">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="text-sm text-gray-300 uppercase tracking-wider">Choose • Deploy • Command • Iterate</span>
      </div>
    </div>
  )
}
