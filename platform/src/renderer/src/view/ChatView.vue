<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- 头部 -->
    <div class="border-b bg-white shadow-sm">
      <div class="max-w-full mx-auto py-4 px-4 sm:px-6">
        <PageHeader header="大模型对话" />
        <div>
          <el-select v-model="usingModel" placeholder="请选择大模型">
            <el-option v-for="item in ableModel" :key="item.id" :label="item.id" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <!-- 聊天内容区域 -->
    <div class="flex-1 overflow-auto min-h-0 px-4 sm:px-6 py-4">
      <div class="space-y-6 h-full">
        <div
          v-for="(message, index) in data.messages"
          :key="index"
          class="flex items-start w-full pb-8"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- 用户消息在右边 -->
          <template v-if="message.role === 'user'">
            <div class="bg-gray-300 rounded-lg shadow-md max-w-[70%] sm:max-w-xl break-words p-4">
              <div class="markdown-body" v-html="renderMarkdown(message.content || '')"></div>
            </div>
            <div
              class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm ml-2"
            >
              U
            </div>
          </template>
          <!-- AI 消息在左边 -->
          <template v-else>
            <div
              class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm mr-2"
            >
              AI
            </div>
            <div
              class="bg-gray-150 p-4 rounded-lg shadow-md max-w-[80%] sm:max-w-xl break-words p-4"
            >
              <div
                v-if="message.role === 'assistant' && message.reasoning_content"
                class="mb-2 text-gray-500 text-sm bg-[#f5f5f5]"
              >
                <div
                  class="markdown-body-resoner text-gray-500 text-sm bg-gray-150 p-2 rounded"
                  v-html="processStreamContent(message.reasoning_content)"
                ></div>
              </div>
              <div class="markdown-body" v-html="processStreamContent(message.content)"></div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 输入框区域 -->
    <div class="m-8 mt-0 border bg-white shadow-md rounded-lg">
      <div class="max-w-full sm:max-w-[900px] mx-auto p-4">
        <div
          class="flex flex-col sm:flex-row items-stretch space-y-2 sm:space-y-0 sm:space-x-4 bg-white rounded-lg border shadow-sm p-2"
        >
          <el-input
            v-model="data.inputMessage"
            type="textarea"
            :rows="3"
            placeholder="输入消息..."
            resize="none"
            class="flex-1 border-none focus:outline-none"
            @keydown.enter.exact.prevent="handleSend"
          />
          <el-button
            type="primary"
            :disabled="!data.inputMessage.trim()"
            :icon="Search"
            class="h-[40px] px-6"
            :loading="data.loading"
            @click="handleSend"
          >
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useConfigStore } from '../store'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/stackoverflow-light.css'
import { ElMessage, useModal } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const configStore = useConfigStore()

// 安全的字符串转换函数
const safeString = (value) => {
  if (value === null || value === undefined) return ''
  return String(value)
}
// 安全的HTML转义函数
const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
// 定义自定义渲染器
const renderer = new marked.Renderer()

// 处理代码块渲染
renderer.code = (code, language) => {
  try {
    // 确保code是字符串
    code = safeString(code)
    language = safeString(language)

    let highlighted = code
    if (language && hljs.getLanguage(language)) {
      try {
        highlighted = hljs.highlight(code, { language }).value
      } catch (e) {
        highlighted = escapeHtml(code)
      }
    } else {
      highlighted = escapeHtml(code)
    }

    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-language">${language || 'text'}</span>
          <button class="copy-button" onclick="copyCodeToClipboard(this)">Copy</button>
        </div>
        <pre class="code-block"><code class="${language ? `language-${language}` : ''}">${highlighted}</code></pre>
      </div>
    `
  } catch (error) {
    console.error('Code block rendering error:', error)
    return `<pre class="code-block"><code>${escapeHtml(code)}</code></pre>`
  }
}
// 段落渲染
renderer.paragraph = (text) => {
  return `<p class="markdown-paragraph whitespace-pre-wrap break-words">${text.text}</p>`
}

// 配置 marked 使用自定义渲染器
marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
  mangle: false,
  headerIds: false
})
// 处理流式内容
const processStreamContent = (content) => {
  if (!content) return ''
  content = safeString(content)

  // 分离代码块和普通文本
  const segments = []
  let currentPos = 0

  // 处理代码块
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // 添加代码块前的文本
    if (match.index > currentPos) {
      const text = content.slice(currentPos, match.index)
      if (text.trim()) {
        segments.push({ type: 'text', content: text })
      }
    }

    // 添加代码块
    segments.push({
      type: 'code',
      language: match[1],
      content: match[2]
    })

    currentPos = match.index + match[0].length
  }

  // 添加剩余的文本
  if (currentPos < content.length) {
    const remainingText = content.slice(currentPos)
    if (remainingText.trim()) {
      segments.push({ type: 'text', content: remainingText })
    }
  }

  // 渲染所有片段
  return segments
    .map((segment) => {
      if (segment.type === 'code') {
        return renderer.code(segment.content, segment.language)
      } else {
        try {
          return marked(segment.content)
        } catch (error) {
          console.error('Text rendering error:', error)
          return `<p>${escapeHtml(segment.content)}</p>`
        }
      }
    })
    .join('\n')
}

// 将文本转换为 markdown
// Markdown 渲染函数
const renderMarkdown = (content) => {
  try {
    if (!content) return ''
    content = safeString(content)
    return marked(content)
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return escapeHtml(content)
  }
}
const data = reactive({
  inputMessage: '',
  messages: [],
  loading: false,
  isR1: false
})
// 复制代码功能
window.copyCodeToClipboard = function (button) {
  const codeBlock = button.closest('.code-block-wrapper').querySelector('code')
  const code = codeBlock.textContent
  // 使用通过 contextBridge 暴露的 API
  if (window.electron.electronAPI) {
    window.electron.electronAPI
      .copyToClipboard(code)
      .then(() => {
        button.textContent = 'Copied!'
        button.disabled = true
        setTimeout(() => {
          button.textContent = 'Copy'
          button.disabled = false
        }, 2000)
      })
      .catch((err) => {
        console.error('Failed to copy:', err)
        button.textContent = 'Error'
        setTimeout(() => {
          button.textContent = 'Copy'
        }, 2000)
      })
  } else {
    // 降级方案：如果不在 Electron 环境中，尝试使用普通的 clipboard API
    navigator.clipboard
      .writeText(code)
      .then(() => {
        button.textContent = 'Copied!'
        button.disabled = true
        setTimeout(() => {
          button.textContent = 'Copy'
          button.disabled = false
        }, 2000)
      })
      .catch((err) => {
        console.error('Failed to copy:', err)
        button.textContent = 'Error'
        setTimeout(() => {
          button.textContent = 'Copy'
        }, 2000)
      })
  }
}

const ableModel = ref(configStore.ableModel)
const usingModel = ref(configStore.usingModel)
const getLocalModel = async () => {
  const res = await window.electron.ipcRenderer.invoke('get-local-model-list')
  console.log(res)
  ableModel.value = res.data
}
getLocalModel()
const handleSend = () => {
  console.log(usingModel.value == '')
  if (usingModel.value == null || usingModel.value == undefined || usingModel.value == '') {
    ElMessage({
      message: '请选择模型',
      type: 'error'
    })
    return
  }
  sendMessageR1()
}

const sendMessageR1 = async () => {
  try {
    data.loading = true
    console.log('调用chat-local-reasoner')
    // 创建用户消息
    const userMessage = {
      role: 'user',
      content: data.inputMessage
    }

    // 创建助手消息占位符，用于显示
    const displayMessage = {
      role: 'assistant',
      content: ''
    }

    // 将消息添加到显示数组中
    data.messages.push(userMessage, displayMessage)

    // 创建用于发送的消息数组
    // 过滤并清理历史消息，确保没有 reasoning_content
    const sendMessages = data.messages
      .slice(0, -2) // 排除最新添加的用户消息和显示消息
      .map((msg) => {
        // 只保留必要的字段，确保没有 reasoning_content
        return {
          role: msg.role,
          content: msg.content || '' // 确保 content 始终有值
        }
      })

    // 添加最新的用户消息，确保它是数组的最后一条消息
    sendMessages.push(userMessage)

    // 验证发送的消息数组
    console.log('发送前的消息数组:', sendMessages)
    // 确认最后一条是用户消息
    if (sendMessages[sendMessages.length - 1].role !== 'user') {
      throw new Error('最后一条消息必须是用户消息')
    }

    // 保存原始输入并清空输入框
    const originalInput = data.inputMessage
    data.inputMessage = ''

    // 清理监听器的函数
    const cleanupListeners = () => {
      window.electron.ipcRenderer.removeAllListeners('chat-stream-reasoning_content')
      window.electron.ipcRenderer.removeAllListeners('chat-stream-content')
      window.electron.ipcRenderer.removeAllListeners('chat-stream-end')
    }

    window.electron.ipcRenderer.on('chat-stream-reasoning_content', (_, chunk) => {
      // 如果 displayMessage.content 不存在则初始化
      // 将推理内容添加到显示消息中
      displayMessage.reasoning_content += chunk 
      // 触发响应式更新
      data.messages = [...data.messages]
    })
    // 处理实际回复内容流
    window.electron.ipcRenderer.on('chat-stream-content', (_, chunk) => {
      // 如果 displayMessage.content 不存在则初始化
      if (!displayMessage.content) {
        displayMessage.content = ''
      }
      // 更新显示消息的内容
      displayMessage.content += chunk
      // 触发响应式更新
      data.messages = [...data.messages]
    })

    // 处理流结束
    window.electron.ipcRenderer.once('chat-stream-end', () => {
      data.loading = false
      cleanupListeners()
      console.log('Stream ended')

      // 检查最后一条消息
      const lastMessage = data.messages[data.messages.length - 1]
      console.log(lastMessage)
      if (lastMessage && (!lastMessage.content || lastMessage.content.trim() === '')) {
        // 移除空消息
        data.messages[data.messages.length - 1].content = '系统繁忙，请稍后再试'
        // 确保 ElMessage 被正确导入和使用
        ElMessage({
          message: '请求超时,请重新发送您的问题',
          type: 'warning'
        })

        // 恢复原始输入
        data.inputMessage = originalInput
      }
    })

    // 创建一个深拷贝，确保数据的纯净性
    const cleanSendMessages = JSON.parse(JSON.stringify(sendMessages)).map((msg) => ({
      role: msg.role,
      content: msg.content
    }))

    // 向主线程发送消息数组
    await window.electron.ipcRenderer.invoke(
      'chat-local-reasoner',
      cleanSendMessages,
      usingModel.value
    )
  } catch (error) {
    console.error('聊天错误:', error)
    const lastMessage = data.messages[data.messages.length - 1]
    if (lastMessage && (!lastMessage.content || lastMessage.content.trim() === '')) {
      data.messages[data.messages.lastIndexOf].content = '发送消息失败'
    }
    ElMessage.error(error.message || '发送消息失败')
    // 发生错误时恢复输入内容
    data.inputMessage = originalInput
    data.loading = false
    cleanupListeners()
  }
}
</script>
<style>
/* Obsidian 样式 */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.code-block-wrapper {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #f1f3f5;
  border-bottom: 1px solid #e1e4e8;
}

.code-language {
  font-family: monospace;
  font-size: 0.9em;
  color: #6a737d;
}

.copy-button {
  padding: 0.25rem 0.75rem;
  font-size: 0.85em;
  color: #24292e;
  background-color: white;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

.copy-button:hover {
  background-color: #f3f4f6;
}

.copy-button:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.code-block {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  max-width: 100%;
  box-sizing: border-box;
}

.text-content {
  margin: 1rem 0;
}

/* 适配暗色模式 */
@media (prefers-color-scheme: dark) {
  .markdown-body {
    color: #c9d1d9;
  }

  .code-block-container {
    background: #161b22;
    border-color: #30363d;
  }

  .code-block-header {
    background: #21262d;
    border-color: #30363d;
  }

  .code-language {
    color: #8b949e;
  }

  .copy-button {
    color: #c9d1d9;
    background-color: #21262d;
    border-color: #30363d;
  }

  .copy-button:hover {
    background-color: #30363d;
  }

  .copy-button:disabled {
    background-color: #282c34;
  }
}

/* 消息气泡容器 */
.flex.items-start.w-full {
  width: 100%;
}

/* 用户消息气泡 */
.flex.items-start.w-full.justify-end .bg-blue-600 {
  background-color: #3b82f6 !important;
  color: white;
  border-radius: 12px 12px 0 12px;
  margin-right: 8px;
}

/* AI消息气泡 */
.flex.items-start.w-full.justify-start .bg-gray-100 {
  background-color: #f3f4f6 !important;
  color: #374151;
  border-radius: 12px 12px 12px 0;
  margin-left: 8px;
}

/* 用户头像 */
.flex.items-start.w-full.justify-end .bg-blue-600 {
  background-color: #3b82f6 !important;
}

/* AI头像 */
.flex.items-start.w-full.justify-start .bg-gray-700 {
  background-color: #6b7280 !important;
}

/* 输入框区域 */
.ml-8.mr-8.mb-8.border.bg-white.shadow-md.rounded-lg {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

/* 输入框 */
.el-textarea__inner {
  background-color: white;
  border-color: #e5e7eb;
  border-radius: 8px;
}

/* 发送按钮 */
.el-button--primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
  border-radius: 8px;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  /* 用户消息气泡 */
  .flex.items-start.w-full.justify-end .bg-blue-600 {
    background-color: #2563eb !important;
    color: white;
  }

  /* AI消息气泡 */
  .flex.items-start.w-full.justify-start .bg-gray-100 {
    background-color: #374151 !important;
    color: #f3f4f6;
  }

  /* 输入框区域 */
  .ml-8.mr-8.mb-8.border.bg-white.shadow-md.rounded-lg {
    background-color: #1f2937;
    border-color: #374151;
  }

  /* 输入框 */
  .el-textarea__inner {
    background-color: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }

  /* 发送按钮 */
  .el-button--primary {
    background-color: #2563eb;
    border-color: #2563eb;
  }
}
</style>
