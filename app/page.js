'use client'
import { useState } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')
    try {
      const response = await fetch(
        `https://dreakchang-n8n-free.hf.space/webhook/2cb93ea0-0cda-4d28-a68f-f43926ffc143?question=${encodeURIComponent(
          question
        )}`
      )
      const text = await response.text()
      setAnswer(text)
    } catch (e) {
      setAnswer('❌ 錯誤：無法取得回應')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-xl p-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">🔧 WMS 問題問答系統</h1>
        <textarea
          className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="請輸入您的 WMS 問題..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? '查詢中...' : '送出問題'}
        </button>
        {answer && (
          <div className="mt-6 p-4 bg-gray-100 rounded-xl border border-gray-200 whitespace-pre-wrap">
            <strong className="text-blue-600">回應：</strong> {answer}
          </div>
        )}
      </div>
    </div>
  )
}
