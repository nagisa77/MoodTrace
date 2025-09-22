import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'moodtrace_logs'

const sanitizeFeelingList = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
    : []

const normalizeFeelings = (entry) => {
  if (!entry || typeof entry !== 'object') {
    return {
      body: [],
      mind: [],
      legacy: '',
    }
  }

  if (
    entry.feelings &&
    typeof entry.feelings === 'object' &&
    !Array.isArray(entry.feelings)
  ) {
    return {
      body: sanitizeFeelingList(entry.feelings.body),
      mind: sanitizeFeelingList(entry.feelings.mind),
      legacy:
        typeof entry.feelings.legacy === 'string'
          ? entry.feelings.legacy
          : typeof entry.feelings.raw === 'string'
            ? entry.feelings.raw
            : '',
    }
  }

  const legacyText =
    typeof entry.feelings === 'string'
      ? entry.feelings
      : typeof entry.feelingsText === 'string'
        ? entry.feelingsText
        : ''

  return {
    body: sanitizeFeelingList(entry.bodyFeelings || entry.feelingsBody),
    mind: sanitizeFeelingList(entry.mindFeelings || entry.feelingsMind),
    legacy: legacyText,
  }
}

const sanitizeEntry = (entry) => {
  if (!entry || typeof entry !== 'object' || !entry.id) {
    return null
  }

  return {
    id: entry.id,
    createdAt: entry.createdAt || new Date().toISOString(),
    event: entry.event || '',
    feelings: normalizeFeelings(entry),
    thoughts: entry.thoughts || '',
    behaviors: entry.behaviors || '',
    consequences: entry.consequences || '',
  }
}

const loadFromStorage = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => sanitizeEntry(item))
      .filter((item) => item)
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
    const normalized = sanitizeEntry(entry)
    if (!normalized) return
    logs.value = [...logs.value, normalized]
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
