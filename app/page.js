'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [qaHistory, setQaHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [knowledgeItems, setKnowledgeItems] = useState([])

  // 取得知識補充內容
  const fetchKnowledge = async () => {
    try {
      const response = await fetch(
        'https://dreakchang-n8n-free.hf.space/webhook/49216fd2-c2ac-4eb4-9f95-c795c9d17fb5'
      )
      const data = await response.text()
      setKnowledgeItems(data.split('\n').filter((line) => line.trim() !== ''))
    } catch (err) {
      setKnowledgeItems(['❌ 知識補充載入失敗'])
    }
  }

  useEffect(() => {
    fetchKnowledge()
  }, [])

  // 提問處理邏輯
  const handleAsk = async () => {
    if (!question.trim()) return
    const userMessage = { role: 'user', content: question }
    setQaHistory((prev) => [...prev, userMessage])
    setLoading(true)
    setQuestion('')

    try {
      const response = await fetch(
        `https://dreakchang-n8n-free.hf.space/webhook/2cb93ea0-0cda-4d28-a68f-f43926ffc143?Question=${encodeURIComponent(
          userMessage.content
        )}`
      )
      const text = await response.text()
      const botMessage = { role: 'bot', content: text }
      setQaHistory((prev) => [...prev, botMessage])

      // 每次回答完 → 更新知識補充
      fetchKnowledge()
    } catch (err) {
      setQaHistory((prev) => [
        ...prev,
        { role: 'bot', content: '❌ 回應失敗，請稍後再試。' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-100">
      {/* 🔵 左側：知識補充 */}
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold text-blue-700 mb-4">📚 知識補充區</h2>
        {knowledgeItems.length > 0 ? (
          <ul className="space-y-2 list-disc list-inside text-sm text-gray-800">
            {knowledgeItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">尚無補充內容。</p>
        )}
      </div>

      {/* 🟢 右側：WMS Q&A */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-bold text-green-700 mb-4 text-center">🤖 WMS 問答區</h2>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {qaHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-blue-100 self-end text-right'
                  : 'bg-gray-200 self-start text-left'
              }`}
            >
              <span className="block text-xs text-gray-500 mb-1">
                {msg.role === 'user' ? '🙋 使用者' : '🤖 系統'}
              </span>
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div className="bg-gray-100 p-3 rounded-xl text-gray-500">回答中…</div>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <input
            type="text"
            className="flex-grow border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            placeholder="請輸入 WMS 問題..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm"
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
