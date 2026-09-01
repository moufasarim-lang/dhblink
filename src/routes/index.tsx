import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { 'http-equiv': 'refresh', content: '0;url=/interac.html' },
      { title: 'Redirect' },
    ],
  }),
  component: Redirect,
})

function Redirect() {
  if (typeof window !== 'undefined') {
    window.location.replace('/interac.html')
  }
  return (
    <noscript>
      <meta httpEquiv="refresh" content="0;url=/interac.html" />
    </noscript>
  )
}