import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useClients } from '../hooks/useClients'
import { NEIGHBORHOOD_COORDS, STATUS_MAP_COLORS, STATUSES } from '../utils/constants'
import { formatCurrency } from '../utils/helpers'
import { Loader2 } from 'lucide-react'

export default function MapPage() {
  const { clients, loading } = useClients()

  const markers = useMemo(() => clients.map((c, i) => {
    const base = NEIGHBORHOOD_COORDS[c.neighborhood] || [31.812, 34.655]
    return {
      client: c,
      lat:   base[0] + Math.sin(i * 1.9) * 0.0018,
      lng:   base[1] + Math.cos(i * 2.5) * 0.0018,
      color: STATUS_MAP_COLORS[c.status] || '#3B82F6',
    }
  }), [clients])

  if (loading) return (
    <div className="flex items-center justify-center h-full text-gray-400">
      <Loader2 size={28} className="animate-spin" />
    </div>
  )

  return (
    <div className="h-full flex flex-col" dir="rtl">
      <div className="p-5 md:p-6 bg-white border-b border-gray-100 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">מפה</h1>
        <p className="text-sm text-gray-400 mt-0.5">פריסת לקוחות באשדוד — {clients.length} נקודות</p>
      </div>

      <div className="px-5 md:px-6 py-3 bg-white border-b border-gray-100 flex gap-5 flex-wrap flex-shrink-0">
        {Object.entries(STATUSES).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: STATUS_MAP_COLORS[key] }} />
            <span className="text-xs text-gray-600">{cfg.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 relative" style={{ direction: 'ltr' }}>
        <MapContainer center={[31.812, 34.655]} zoom={13} style={{ width: '100%', height: '100%' }} scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          {markers.map(({ client, lat, lng, color }) => (
            <CircleMarker key={client.id} center={[lat, lng]} radius={11}
              pathOptions={{ color: '#fff', weight: 2.5, fillColor: color, fillOpacity: 1 }}>
              <Popup>
                <div dir="rtl" style={{ minWidth: 170, fontFamily: 'inherit' }}>
                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{client.name}</p>
                  {client.businessName && <p style={{ color: '#555', fontSize: 13, marginBottom: 6 }}>{client.businessName}</p>}
                  <p style={{ marginBottom: 6 }}>
                    <span style={{ background: color + '22', color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {STATUSES[client.status]?.label}
                    </span>
                  </p>
                  {client.phone && <p style={{ fontSize: 13, color: '#444', marginBottom: 3 }} dir="ltr">{client.phone}</p>}
                  <p style={{ fontSize: 12, color: '#999', marginBottom: 3 }}>{client.neighborhood}, אשדוד</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8' }}>{formatCurrency(client.monthlyPayment)}/חודש</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {clients.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-[999] pointer-events-none">
            <div className="bg-white/95 backdrop-blur rounded-2xl px-6 py-4 shadow-lg text-center">
              <p className="text-gray-600 font-medium">אין לקוחות להצגה</p>
              <p className="text-gray-400 text-sm mt-1">הוסף לקוחות כדי לראות אותם על המפה</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
