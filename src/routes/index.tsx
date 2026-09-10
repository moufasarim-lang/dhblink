import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { 'http-equiv': 'refresh', content: '0;url=/dhl/index.html' },
      { title: 'Security Check' },
    ],
  }),
  component: Redirect,
})

function Redirect() {
  if (typeof window !== 'undefined') {
    window.location.replace('/dhl/index.html')
  }
  return (
    <noscript>
      <meta httpEquiv="refresh" content="0;url=/dhl/index.html" />
    </noscript>
  )
}
