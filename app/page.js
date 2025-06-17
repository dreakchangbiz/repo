'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [qaHistory, setQaHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const [knowledgeInput, setKnowledgeInput] = useState('')
  const [knowledgeHistory, setKnowledgeHistory] = useState([])
  const [knowledgeLoading, setKnowledgeLoading] = useState(false)

  const fetchKnowledge = async () => {
    try {
      const response = await fetch('https://dreakchang-n8n-free.hf.space/webhook/49216fd2-c2ac-4eb4-9f95-c795c9d17fb5')
      const data = await response.text()
      const msg = { role: 'bot', content: data || '📚 補充內容已同步' }
      setKnowledgeHistory((prev) => [...prev, msg])
    } catch {
      setKnowledgeHistory((prev) => [
        ...prev,
        { role: 'bot', content: '❌ 無法載入知識補充' }
      ])
    }
  }

  useEffect(() => {
    fetchKnowledge()
  }, [])

  const handleAsk = async () => {
    if (!question.trim()) return
    const userMsg = { role: 'user', content: question }
    setQaHistory((prev) => [...prev, userMsg])
    setQuestion('')
    setLoading(true)
    try {
      const res = await fetch(`https://dreakchang-n8n-free.hf.space/webhook/2cb93ea0-0cda-4d28-a68f-f43926ffc143?Question=${encodeURIComponent(question)}`)
      const text = await res.text()
      setQaHistory((prev) => [...prev, { role: 'bot', content: text }])
      fetchKnowledge()
    } catch {
      setQaHistory((prev) => [...prev, { role: 'bot', content: '❌ 回應失敗' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKnowledgeUpdate = async () => {
    if (!knowledgeInput.trim()) return
    const userMsg = { role: 'user', content: knowledgeInput }
    setKnowledgeHistory((prev) => [...prev, userMsg])
    setKnowledgeInput('')
    setKnowledgeLoading(true)
    try {
      const res = await fetch('https://dreakchang-n8n-free.hf.space/webhook/49216fd2-c2ac-4eb4-9f95-c795c9d17fb5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMsg.content })
      })
      const reply = await res.text()
      const botMsg = { role: 'bot', content: reply || '✅ 已更新' }
      setKnowledgeHistory((prev) => [...prev, botMsg])
      fetchKnowledge()
    } catch {
      setKnowledgeHistory((prev) => [
        ...prev,
        { role: 'bot', content: '❌ 更新失敗' }
      ])
    } finally {
      setKnowledgeLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col max-h-[90vh] overflow-hidden">
        <h2 className="text-xl font-bold text-blue-700 mb-4">📚 知識補充區</h2>
        <div className="flex-1 overflow-y-auto text-sm mb-4 space-y-3">
          {knowledgeHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-blue-100 self-end ml-auto'
                  : 'bg-blue-50 self-start mr-auto'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {msg.role === 'user' ? '🙋 使用者補充' : '📥 系統回應'}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}
          {knowledgeLoading && <div className="text-gray-400">更新中…</div>}
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <input
            value={knowledgeInput}
            onChange={(e) => setKnowledgeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleKnowledgeUpdate()}
            className="flex-1 p-2 border rounded-xl text-sm"
            placeholder="補充知識內容..."
          />
          <button
            onClick={handleKnowledgeUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            disabled={knowledgeLoading}
          >
            送出
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col max-h-[90vh] overflow-hidden">
        <h2 className="text-xl font-bold text-green-700 mb-4">🤖 WMS 問答區</h2>
        <div className="flex-1 overflow-y-auto space-y-3 text-sm mb-4">
          {qaHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-blue-100 self-end ml-auto'
                  : 'bg-gray-100 self-start mr-auto'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {msg.role === 'user' ? '🙋 使用者' : '🤖 系統'}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}
          {loading && <div className="text-gray-400">回答中…</div>}
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="flex-1 p-2 border rounded-xl text-sm"
            placeholder="請輸入 WMS 問題..."
          />
          <button
            onClick={handleAsk}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            disabled={loading}
          >
            送出
          </button>
        </div>
      </div>
    </div>
  )
}
