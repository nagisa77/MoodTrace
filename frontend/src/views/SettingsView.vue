<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useSettings } from '../composables/useSettings'

const { settings, updateSettings, clearSettings } = useSettings()

const apiKey = ref(settings.value.openaiApiKey || '')
const isKeyVisible = ref(false)
const feedback = ref('')
let feedbackTimer = null

const resetFeedback = (message) => {
  feedback.value = message
  if (feedbackTimer) {
    window.clearTimeout(feedbackTimer)
  }
  feedbackTimer = window.setTimeout(() => {
    feedback.value = ''
    feedbackTimer = null
  }, 2800)
}

const toggleVisibility = () => {
  isKeyVisible.value = !isKeyVisible.value
}

const isDirty = computed(
  () => apiKey.value.trim() !== (settings.value.openaiApiKey || '')
)

const handleSubmit = () => {
  updateSettings({ openaiApiKey: apiKey.value.trim() })
  resetFeedback('已保存 OpenAI API Key。')
}

const handleClear = () => {
  apiKey.value = ''
  clearSettings()
  resetFeedback('已清除保存的 API Key。')
}

onBeforeUnmount(() => {
  if (feedbackTimer) {
    window.clearTimeout(feedbackTimer)
    feedbackTimer = null
  }
})
</script>

<template>
  <section class="view-container narrow">
    <header class="view-header">
      <div>
        <h1>设置</h1>
        <p class="subtitle">在这里管理 AI 分析所需的 OpenAI API Key。</p>
      </div>
    </header>

    <form class="log-form" @submit.prevent="handleSubmit">
      <div class="form-field">
        <span>OpenAI API Key</span>
        <p class="form-hint">
          我们不会把密钥发送到任何第三方服务器，只会保存在你当前浏览器的本地存储中。
        </p>
        <div class="apikey-input">
          <input
            v-model="apiKey"
            :type="isKeyVisible ? 'text' : 'password'"
            placeholder="例如：sk-..."
            autocomplete="off"
          />
          <button
            class="secondary-button"
            type="button"
            @click="toggleVisibility"
          >
            {{ isKeyVisible ? '隐藏' : '显示' }}
          </button>
        </div>
        <p class="form-hint subtle">
          如需申请密钥，可以前往
          <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener">OpenAI 控制台</a>。
        </p>
      </div>

      <div class="form-actions">
        <button class="secondary-button" type="button" @click="handleClear">
          清除
        </button>
        <button class="primary-button" type="submit" :disabled="!isDirty">
          保存
        </button>
      </div>

      <p v-if="feedback" class="form-success">{{ feedback }}</p>
    </form>
  </section>
</template>
