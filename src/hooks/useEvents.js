import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { generateId } from '../utils/helpers'

function fromDB(r) {
  return {
    id:          r.id,
    title:       r.title,
    date:        r.date,
    clientId:    r.client_id   || '',
    description: r.description || '',
    createdAt:   r.created_at,
  }
}

function toDB(e) {
  return {
    id:          e.id,
    title:       e.title,
    date:        e.date,
    client_id:   e.clientId    || null,
    description: e.description || null,
    created_at:  e.createdAt,
  }
}

export function useEvents() {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    supabase.from('events').select('*').order('date', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setEvents((data || []).map(fromDB))
        setLoading(false)
      })
  }, [])

  const addEvent = useCallback(async (event) => {
    const row = toDB({ ...event, id: generateId(), createdAt: new Date().toISOString() })
    const { data, error } = await supabase.from('events').insert(row).select().single()
    if (data) setEvents(prev => [...prev, fromDB(data)].sort((a,b) => a.date.localeCompare(b.date)))
    return error
  }, [])

  const updateEvent = useCallback(async (event) => {
    const row = toDB(event)
    const { data, error } = await supabase.from('events').update(row).eq('id', event.id).select().single()
    if (data) setEvents(prev => prev.map(e => e.id === event.id ? fromDB(data) : e))
    return error
  }, [])

  const deleteEvent = useCallback(async (id) => {
    await supabase.from('events').delete().eq('id', id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }, [])

  return { events, loading, error, addEvent, updateEvent, deleteEvent }
}
