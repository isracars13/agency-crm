import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { generateId } from '../utils/helpers'
import { geocodeAddress } from '../utils/geocode'

function fromDB(r) {
  return {
    id:             r.id,
    name:           r.name,
    businessName:   r.business_name   || '',
    phone:          r.phone           || '',
    neighborhood:   r.neighborhood    || 'Центр',
    status:         r.status          || 'lead',
    monthlyPayment: Number(r.monthly_payment) || 0,
    startDate:      r.start_date      || '',
    notes:          r.notes           || '',
    address:        r.address         || '',
    lat:            r.lat             || null,
    lng:            r.lng             || null,
    createdAt:      r.created_at,
  }
}

function toDB(c) {
  return {
    id:              c.id,
    name:            c.name,
    business_name:   c.businessName   || null,
    phone:           c.phone          || null,
    neighborhood:    c.neighborhood,
    status:          c.status,
    monthly_payment: Number(c.monthlyPayment) || 0,
    start_date:      c.startDate      || null,
    notes:           c.notes          || null,
    address:         c.address        || null,
    lat:             c.lat            || null,
    lng:             c.lng            || null,
    created_at:      c.createdAt,
  }
}

async function resolveCoords(client, prevAddress) {
  if (!client.address) return { lat: null, lng: null }
  if (client.address === prevAddress && client.lat) return { lat: client.lat, lng: client.lng }
  const coords = await geocodeAddress(client.address)
  return coords || { lat: null, lng: null }
}

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    supabase.from('clients').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setClients((data || []).map(fromDB))
        setLoading(false)
      })
  }, [])

  const addClient = useCallback(async (client) => {
    const coords = await resolveCoords(client, null)
    const row = toDB({ ...client, id: generateId(), createdAt: new Date().toISOString(), ...coords })
    const { data, error } = await supabase.from('clients').insert(row).select().single()
    if (data) setClients(prev => [fromDB(data), ...prev])
    return error
  }, [])

  const updateClient = useCallback(async (client) => {
    const prev = clients.find(c => c.id === client.id)
    const coords = await resolveCoords(client, prev?.address)
    const row = toDB({ ...client, ...coords })
    const { data, error } = await supabase.from('clients').update(row).eq('id', client.id).select().single()
    if (data) setClients(prev => prev.map(c => c.id === client.id ? fromDB(data) : c))
    return error
  }, [clients])

  const deleteClient = useCallback(async (id) => {
    await supabase.from('clients').delete().eq('id', id)
    setClients(prev => prev.filter(c => c.id !== id))
  }, [])

  return { clients, loading, error, addClient, updateClient, deleteClient }
}
