const ICON_COLORS = {
  green:  'bg-green-50  text-green-600',
  blue:   'bg-blue-50   text-blue-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  red:    'bg-red-50    text-red-600',
}

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1 truncate">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl flex-shrink-0 ${ICON_COLORS[color]}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  )
}
