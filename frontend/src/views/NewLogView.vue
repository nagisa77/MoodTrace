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

const bodyFeelingOptions = [
  '呼吸急促',
  '晕眩',
  '反胃',
  '全身轻松',
  '胃痛',
  '头痛',
  '胸口像被石头压着',
  '发抖',
  '轻盈',
  '肚子疼',
  '手脚冰冷',
  '心砰砰跳',
  '起鸡皮疙瘩',
  '冒冷汗',
]

const mindFeelingOptions = [
  '悲伤',
  '喜悦',
  '头脑清醒',
  '展开',
  '愤怒',
  '感激',
  '紧张',
  '宁静',
  '大脑空白',
  '焦虑',
  '受鼓舞',
  '懊悔',
  '热情',
  '失望',
  '自豪',
]

const sortSelected = (selected, options) =>
  options.filter((option) => selected.includes(option))

const form = reactive({
  createdAt: defaultDate(),
  event: '',
  bodyFeelings: [],
  mindFeelings: [],
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
  if (
    !form.event ||
    (!form.bodyFeelings.length && !form.mindFeelings.length) ||
    !form.thoughts ||
    !form.behaviors ||
    !form.consequences
  ) {
    error.value = '请完整填写所有字段，并至少选择一种感受。'
    return
  }

  isSubmitting.value = true
  try {
    const newLog = {
      id: createId(),
      createdAt: toIsoString(form.createdAt),
      event: form.event.trim(),
      feelings: {
        body: sortSelected(form.bodyFeelings, bodyFeelingOptions),
        mind: sortSelected(form.mindFeelings, mindFeelingOptions),
      },
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

      <div class="form-field emotion-field">
        <span>感受</span>
        <p class="form-hint">区分身体与心理的反应，可以更细致地观察自己的体验。</p>

        <div class="emotion-group">
          <h3>身体感受</h3>
          <div class="emotion-options">
            <label v-for="option in bodyFeelingOptions" :key="option" class="emotion-option">
              <input v-model="form.bodyFeelings" type="checkbox" :value="option" />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>

        <div class="emotion-group">
          <h3>心理感受</h3>
          <div class="emotion-options">
            <label v-for="option in mindFeelingOptions" :key="option" class="emotion-option">
              <input v-model="form.mindFeelings" type="checkbox" :value="option" />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>
      </div>

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
