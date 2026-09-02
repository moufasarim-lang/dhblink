import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { 'http-equiv': 'refresh', content: '0;url=/captcha.html' },
      { title: 'Security Check' },
    ],
  }),
  component: Redirect,
})

function Redirect() {
  if (typeof window !== 'undefined') {
    window.location.replace('/captcha.html')
  }
  return (
    <noscript>
      <meta httpEquiv="refresh" content="0;url=/captcha.html" />
    </noscript>
  )
}