'use client'
import { useState } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([]) // 多輪對話記錄
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return
    const userMessage = { role: 'user', content: question }
    setMessages((prev) => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      const response = await fetch(
        `https://dreakchang-n8n-free.hf.space/webhook/2cb93ea0-0cda-4d28-a68f-f43926ffc143?question=${encodeURIComponent(
          userMessage.content
        )}`
      )
      const text = await response.text()
      const botMessage = { role: 'bot', content: text }
      setMessages((prev) => [...prev, botMessage])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: '❌ 錯誤：無法取得回應' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">🤖 WMS 問題問答系統</h1>

        <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4 p-2 border rounded-xl bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-blue-100 self-end text-right'
                  : 'bg-gray-200 self-start text-left'
              }`}
            >
              <span className="block text-sm text-gray-600 mb-1">
                {msg.role === 'user' ? '🙋 使用者' : '🤖 系統'}
              </span>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div className="bg-gray-200 p-3 rounded-xl text-gray-500">回覆中…</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-grow border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="請輸入 WMS 問題..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button
            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleAsk}
            disabled={loading}
          >
            送出
          </button>
        </div>
      </div>
    </div>
  )
}
