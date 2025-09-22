const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const trimText = (text, limit = 80) => {
  if (!text) return ''
  return text.length > limit ? `${text.slice(0, limit)}…` : text
}

export async function analyzeLog(log) {
  await wait(600 + Math.random() * 600)

  const event = trimText(log.event, 100)
  const feelings = trimText(log.feelings, 100)
  const thoughts = trimText(log.thoughts, 100)
  const behaviors = trimText(log.behaviors, 100)
  const consequences = trimText(log.consequences, 100)

  const questions = [
    `当你回顾「${event || '这个情境'}」时，哪些感受最想被看见？`,
    `在那些想法（例如「${thoughts || '...'}」）之下，是否藏着某些更深的期待或担心？`,
    `如果再次面对类似的经历，你希望自己的行为或选择（比如「${behaviors || '...'}」）有哪些不同？`,
    `这些后果（例如「${consequences || '...'}」）带给你什么提醒？`
  ]

  const reflection = [
    `我听见你提到在「${event || '这个事件'}」中经历了「${feelings || '复杂的情绪'}」。`,
    `这些情绪似乎和你的想法「${thoughts || '...'}」彼此呼应，影响到你当时的反应。`,
    `我们可以慢慢探索，当感受到这些情绪时，你最需要的支持或资源是什么。`
  ]

  return `${reflection.join('\n')}\n\n可以试着想一想：\n- ${questions[0]}\n- ${questions[1]}\n- ${questions[2]}\n- ${questions[3]}\n\n如果愿意，你也可以把新的观察写进下一篇日志里，我们再继续一起整理。`
}
