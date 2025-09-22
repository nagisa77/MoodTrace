import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'moodtrace_logs'

const loadFromStorage = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item && typeof item === 'object' && item.id)
      .map((item) => ({
        id: item.id,
        createdAt: item.createdAt || new Date().toISOString(),
        event: item.event || '',
        feelings: item.feelings || '',
        thoughts: item.thoughts || '',
        behaviors: item.behaviors || '',
        consequences: item.consequences || '',
      }))
  } catch (error) {
    console.warn('无法从本地存储加载日志：', error)
    return []
  }
}

const logs = ref(loadFromStorage())

if (typeof window !== 'undefined') {
  watch(
    logs,
    (value) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
  )
}

export function useLogs() {
  const sortedLogs = computed(() =>
    [...logs.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  )

  const addLog = (entry) => {
    logs.value = [...logs.value, entry]
  }

  const removeLog = (id) => {
    logs.value = logs.value.filter((log) => log.id !== id)
  }

  const getLog = (id) => logs.value.find((log) => log.id === id)

  return {
    logs: sortedLogs,
    addLog,
    removeLog,
    getLog,
  }
}
