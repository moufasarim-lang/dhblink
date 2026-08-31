import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'deploi-ca-website-5ycwgzv7',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_4xTZmjAjdkAjNt3pw_n51ayrjrgSfjJb',
  authRequired: false,
  auth: { mode: 'managed' },
})
