import { ref, watch } from 'vue'

const STORAGE_KEY = 'moodtrace_settings'

const DEFAULT_SETTINGS = {
  openaiApiKey: '',
}

const sanitizeSettings = (value) => {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_SETTINGS }
  }

  return {
    openaiApiKey: typeof value.openaiApiKey === 'string' ? value.openaiApiKey : '',
  }
}

const loadFromStorage = () => {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_SETTINGS }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_SETTINGS, ...sanitizeSettings(parsed) }
  } catch (error) {
    console.warn('无法从本地存储加载设置：', error)
    return { ...DEFAULT_SETTINGS }
  }
}

const settings = ref(loadFromStorage())

if (typeof window !== 'undefined') {
  watch(
    settings,
    (value) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeSettings(value)))
    },
    { deep: true }
  )
}

export function useSettings() {
  const updateSettings = (patch) => {
    settings.value = { ...settings.value, ...sanitizeSettings(patch) }
  }

  const clearSettings = () => {
    settings.value = { ...DEFAULT_SETTINGS }
  }

  return {
    settings,
    updateSettings,
    clearSettings,
  }
}
