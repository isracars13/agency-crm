export async function geocodeAddress(address) {
  if (!address || address.trim().length < 3) return null
  try {
    const q = encodeURIComponent(`${address}, Ashdod, Israel`)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      { headers: { 'User-Agent': 'AgencyCRM/1.0' } }
    )
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}
