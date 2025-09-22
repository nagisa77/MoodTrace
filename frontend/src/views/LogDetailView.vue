<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLogs } from '../composables/useLogs'
import { analyzeLog } from '../services/ai'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const { getLog, removeLog } = useLogs()

const log = computed(() => getLog(props.id))

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const formattedDate = computed(() => {
  if (!log.value) return ''
  const date = new Date(log.value.createdAt)
  if (Number.isNaN(date.getTime())) return '未知时间'
  return dateFormatter.format(date)
})

const isAnalyzing = ref(false)
const analysis = ref('')
const analysisError = ref('')

const handleDelete = () => {
  if (!log.value) return
  const ok = window.confirm('确定要删除这篇日志吗？删除后无法恢复。')
  if (!ok) return
  removeLog(log.value.id)
  router.push({ name: 'logs' })
}

const startAnalysis = async () => {
  if (!log.value || isAnalyzing.value) return
  analysisError.value = ''
  analysis.value = ''
  isAnalyzing.value = true
  try {
    analysis.value = await analyzeLog(log.value)
  } catch (error) {
    console.error(error)
    analysisError.value = '分析出现问题，请稍后再试。'
  } finally {
    isAnalyzing.value = false
  }
}
</script>

<template>
  <section class="view-container narrow">
    <div v-if="!log" class="empty-state">
      <p>没有找到这篇日志，可能已被删除。</p>
      <RouterLink class="primary-button" to="/">返回列表</RouterLink>
    </div>
    <template v-else>
      <header class="view-header">
        <div>
          <h1>日志详情</h1>
          <p class="subtitle">记录于 {{ formattedDate }}</p>
        </div>
        <button class="danger-button" type="button" @click="handleDelete">删除</button>
      </header>

      <article class="log-detail">
        <dl>
          <div>
            <dt>事件</dt>
            <dd>{{ log.event }}</dd>
          </div>
          <div>
            <dt>感受</dt>
            <dd>{{ log.feelings }}</dd>
          </div>
          <div>
            <dt>想法</dt>
            <dd>{{ log.thoughts }}</dd>
          </div>
          <div>
            <dt>行为</dt>
            <dd>{{ log.behaviors }}</dd>
          </div>
          <div>
            <dt>后果</dt>
            <dd>{{ log.consequences }}</dd>
          </div>
        </dl>
      </article>

      <section class="analysis-panel">
        <header>
          <h2>AI 助手</h2>
          <p>以心理咨询师的风格，陪你探索这篇日志。</p>
        </header>
        <button class="primary-button" type="button" :disabled="isAnalyzing" @click="startAnalysis">
          {{ isAnalyzing ? '分析中…' : 'AI 分析' }}
        </button>
        <p v-if="analysisError" class="form-error">{{ analysisError }}</p>
        <div v-if="analysis" class="analysis-result">
          <p
            v-for="(paragraph, index) in analysis.split('\n').filter(Boolean)"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>
    </template>
  </section>
</template>
