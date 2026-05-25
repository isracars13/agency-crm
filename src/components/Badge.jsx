import { STATUSES } from '../utils/constants'

export default function Badge({ status, className = '' }) {
  const cfg = STATUSES[status] || STATUSES.lead
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} ${className}`}>
      {cfg.label}
    </span>
  )
}
