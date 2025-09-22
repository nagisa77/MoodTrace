import { useSettings } from '../composables/useSettings'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

const truncate = (text, limit = 240) => {
  if (!text) return ''
  return text.length > limit ? `${text.slice(0, limit)}…` : text
}

const listToText = (values) =>
  Array.isArray(values)
    ? values
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
        .join('、')
    : ''

const normalizeFeelingsForPrompt = (feelings) => {
  if (!feelings || typeof feelings !== 'object') {
    return {
      body: '',
      mind: '',
      legacy: '',
    }
  }

  const body = listToText(feelings.body)
  const mind = listToText(feelings.mind)
  const legacy = typeof feelings.legacy === 'string' ? feelings.legacy : ''

  return {
    body,
    mind,
    legacy,
  }
}

const buildMessages = (log) => {
  const feelings = normalizeFeelingsForPrompt(log.feelings)

  const fields = [
    `事件：${truncate(log.event || '未记录')}`,
    `身体感受：${truncate(feelings.body || '未选择')}`,
    `心理感受：${truncate(feelings.mind || feelings.legacy || '未选择')}`,
    `想法：${truncate(log.thoughts || '未记录')}`,
    `行为：${truncate(log.behaviors || '未记录')}`,
    `后果：${truncate(log.consequences || '未记录')}`,
  ]

  if (feelings.legacy && feelings.mind) {
    fields.splice(3, 0, `其他感受记录：${truncate(feelings.legacy)}`)
  }

  const userContent = [
    '以下是一篇情绪日志，请以中文进行共情式的反馈：',
    ...fields,
    '',
    '请遵循以下原则：',
    '1. 以温柔、非评判性的语气，先回应对方的感受与处境。',
    '2. 提供 2-3 个启发式的问题，帮助对方进一步观察自己的需要或信念。',
    '3. 如果合适，可以给出一条简单的自我照顾或下一步行动建议。',
    '4. 全文保持在 4 段以内，并以换行分段。',
  ].join('\n')

  return [
    {
      role: 'system',
      content:
        '你是一位擅长情绪支持的中文心理咨询助理，会以共情与好奇回应来访者，避免医学诊断与绝对化语言。',
    },
    {
      role: 'user',
      content: userContent,
    },
  ]
}

export async function analyzeLog(log) {
  const { settings } = useSettings()
  const apiKey = settings.value.openaiApiKey?.trim()

  if (!apiKey) {
    const error = new Error('请先在设置中填写 OpenAI API Key。')
    error.code = 'missing_api_key'
    throw error
  }

  const messages = buildMessages(log)

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.8,
        max_tokens: 600,
      }),
    })

    if (!response.ok) {
      let detail = '请求 OpenAI 接口时出现问题。'
      try {
        const errorPayload = await response.json()
        detail = errorPayload?.error?.message || detail
      } catch (parseError) {
        // ignore parse errors
      }

      const error = new Error(detail)
      error.status = response.status
      throw error
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content?.trim()

    if (!content) {
      throw new Error('AI 没有返回内容，请稍后重试。')
    }

    return content
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('无法连接到 OpenAI 服务，请检查网络或稍后再试。')
    }
    throw error
  }
}
