import './globals.css'

export const metadata = {
  title: 'WMS Q&A',
  description: 'WMS 問題問答介面 powered by n8n'
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  )
}
