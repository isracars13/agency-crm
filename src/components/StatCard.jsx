const ICON_COLORS = {
  green:  'bg-green-900  text-green-400',
  blue:   'bg-blue-900   text-blue-400',
  orange: 'bg-orange-900 text-orange-400',
  purple: 'bg-purple-900 text-purple-400',
  red:    'bg-red-900    text-red-400',
}

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-gray-400 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-100 mt-1 truncate">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl flex-shrink-0 ${ICON_COLORS[color]}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  )
}
