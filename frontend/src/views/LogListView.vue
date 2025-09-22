<script setup>
import { computed } from 'vue'
import { useLogs } from '../composables/useLogs'

const { logs } = useLogs()

const hasLogs = computed(() => logs.value.length > 0)

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
})

const summarizeEmotion = (text) => {
  if (!text) return '未填写情绪'
  const parts = text
    .replace(/。|！|？|\n/g, ' ')
    .split(/[、，,；;\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
  return parts[0] || '未填写情绪'
}

const summarizeEvent = (text) => {
  if (!text) return '未填写事件'
  return text.length > 40 ? `${text.slice(0, 40)}…` : text
}

const formatDate = (iso) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '未知时间'
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`
}
</script>

<template>
  <section class="view-container">
    <header class="view-header">
      <div>
        <h1>情绪日志</h1>
        <p class="subtitle">记录事件、感受、想法与行为的变化，帮助自己更好地观察模式。</p>
      </div>
      <RouterLink class="primary-button" to="/new">新建日志</RouterLink>
    </header>

    <div v-if="!hasLogs" class="empty-state">
      <p>还没有日志。开始记录你的情绪旅程吧！</p>
      <RouterLink class="primary-button ghost" to="/new">立即记录</RouterLink>
    </div>

    <ul v-else class="log-list">
      <li v-for="log in logs" :key="log.id" class="log-card">
        <RouterLink :to="{ name: 'log-detail', params: { id: log.id } }">
          <div class="log-card__header">
            <span class="log-card__date">{{ formatDate(log.createdAt) }}</span>
            <span class="log-card__emotion">{{ summarizeEmotion(log.feelings) }}</span>
          </div>
          <p class="log-card__event">{{ summarizeEvent(log.event) }}</p>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
