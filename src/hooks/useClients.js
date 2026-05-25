import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { generateId } from '../utils/helpers'

function fromDB(r) {
  return {
    id:             r.id,
    name:           r.name,
    businessName:   r.business_name   || '',
    phone:          r.phone           || '',
    neighborhood:   r.neighborhood    || 'מרכז',
    status:         r.status          || 'lead',
    monthlyPayment: Number(r.monthly_payment) || 0,
    startDate:      r.start_date      || '',
    notes:          r.notes           || '',
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
    created_at:      c.createdAt,
  }
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
    const row = toDB({ ...client, id: generateId(), createdAt: new Date().toISOString() })
    const { data, error } = await supabase.from('clients').insert(row).select().single()
    if (data) setClients(prev => [fromDB(data), ...prev])
    return error
  }, [])

  const updateClient = useCallback(async (client) => {
    const row = toDB(client)
    const { data, error } = await supabase.from('clients').update(row).eq('id', client.id).select().single()
    if (data) setClients(prev => prev.map(c => c.id === client.id ? fromDB(data) : c))
    return error
  }, [])

  const deleteClient = useCallback(async (id) => {
    await supabase.from('clients').delete().eq('id', id)
    setClients(prev => prev.filter(c => c.id !== id))
  }, [])

  return { clients, loading, error, addClient, updateClient, deleteClient }
}
