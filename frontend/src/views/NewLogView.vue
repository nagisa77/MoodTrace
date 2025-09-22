<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLogs } from '../composables/useLogs'

const router = useRouter()
const { addLog } = useLogs()

const defaultDate = () => {
  const now = new Date()
  now.setSeconds(0, 0)
  return now.toISOString().slice(0, 16)
}

const form = reactive({
  createdAt: defaultDate(),
  event: '',
  feelings: '',
  thoughts: '',
  behaviors: '',
  consequences: '',
})

const isSubmitting = ref(false)
const error = ref('')

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `log-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const toIsoString = (value) => {
  if (!value) return new Date().toISOString()
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString()
  }
  return parsed.toISOString()
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  error.value = ''
  if (!form.event || !form.feelings || !form.thoughts || !form.behaviors || !form.consequences) {
    error.value = '请完整填写所有字段。'
    return
  }

  isSubmitting.value = true
  try {
    const newLog = {
      id: createId(),
      createdAt: toIsoString(form.createdAt),
      event: form.event.trim(),
      feelings: form.feelings.trim(),
      thoughts: form.thoughts.trim(),
      behaviors: form.behaviors.trim(),
      consequences: form.consequences.trim(),
    }

    addLog(newLog)
    await router.push({ name: 'log-detail', params: { id: newLog.id } })
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <section class="view-container narrow">
    <header class="view-header">
      <div>
        <h1>新建情绪日志</h1>
        <p class="subtitle">记录一个当下或近期的重要情绪事件。</p>
      </div>
    </header>

    <form class="log-form" @submit.prevent="handleSubmit">
      <label class="form-field">
        <span>创建时间</span>
        <input v-model="form.createdAt" type="datetime-local" required />
      </label>

      <label class="form-field">
        <span>事件</span>
        <textarea v-model.trim="form.event" rows="3" placeholder="描述发生了什么" required></textarea>
      </label>

      <label class="form-field">
        <span>感受</span>
        <textarea v-model.trim="form.feelings" rows="3" placeholder="当时体验到的情绪" required></textarea>
      </label>

      <label class="form-field">
        <span>想法</span>
        <textarea v-model.trim="form.thoughts" rows="3" placeholder="出现了哪些自动化想法或信念" required></textarea>
      </label>

      <label class="form-field">
        <span>行为</span>
        <textarea v-model.trim="form.behaviors" rows="3" placeholder="你如何回应或行动" required></textarea>
      </label>

      <label class="form-field">
        <span>后果</span>
        <textarea v-model.trim="form.consequences" rows="3" placeholder="事件之后发生了什么" required></textarea>
      </label>

      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="form-actions">
        <button class="secondary-button" type="button" @click="handleCancel">取消</button>
        <button class="primary-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '保存中…' : '保存日志' }}
        </button>
      </div>
    </form>
  </section>
</template>
