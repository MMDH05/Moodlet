import { useState, useCallback, useEffect } from 'react'
import type { MoodEntry, MoodRating } from '../types/mood'

const STORAGE_KEY = 'moodlet_entries'

function loadFromStorage(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as MoodEntry[]) : []
  } catch {
    return []
  }
}

function saveToStorage(entries: MoodEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export interface AddEntryPayload {
  journalText: string
  moods: MoodRating[]
}

export interface UseMoodEntriesReturn {
  entries: MoodEntry[]
  addEntry: (payload: AddEntryPayload) => MoodEntry
  deleteEntry: (id: string) => void
  totalCount: number
}

export function useMoodEntries(): UseMoodEntriesReturn {
  const [entries, setEntries] = useState<MoodEntry[]>(loadFromStorage)

  // Persist any time entries change
  useEffect(() => {
    saveToStorage(entries)
  }, [entries])

  const addEntry = useCallback((payload: AddEntryPayload): MoodEntry => {
    const newEntry: MoodEntry = {
      id: generateId(),
      timestamp: Date.now(),
      journalText: payload.journalText.trim(),
      moods: payload.moods,
    }
    setEntries((prev) => [newEntry, ...prev])
    return newEntry
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return {
    entries,
    addEntry,
    deleteEntry,
    totalCount: entries.length,
  }
}
