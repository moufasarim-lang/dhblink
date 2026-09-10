import re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

content = open('sendit.py', 'r', encoding='utf-8-sig').read()

auth  = re.search(r'AUTH_TOKEN = "(.+?)"', content).group(1)
xsrf  = re.search(r'XSRF_TOKEN = "(.+?)"', content).group(1)
cookie= re.search(r'COOKIE = "(.+?)"', content).group(1)
fid   = re.search(r'FIELD_ID = "(.+?)"', content).group(1)
cid   = re.search(r'CONVERSATION_ID = "(.+?)"', content).group(1)
chuid = re.search(r'CHANNEL_UID = "(.+?)"', content).group(1)

html = (
  '<div style="margin:0;padding:0;background:#f4f6fb;font-family:Segoe UI,Arial,sans-serif;">'
  '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">'
  '<tr><td align="center">'
  '<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">'
  '<tr><td style="background:linear-gradient(135deg,#667eea,#764ba2);padding:40px;text-align:center;">'
  '<div style="font-size:38px;margin-bottom:8px;">&#128156;</div>'
  '<h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Votre facture vous attend&#160;!</h1>'
  '<p style="margin:10px 0 0;color:rgba(255,255,255,.85);font-size:15px;">Un petit rappel tout doux de notre part</p>'
  '</td></tr>'
  '<tr><td style="padding:40px;">'
  '<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">Bonjour &#128522;,</p>'
  '<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">Nous vous contactons car <strong>une facture est en attente</strong> de votre r&egrave;glement. C&rsquo;est rapide et s&eacute;curis&eacute;&#160;!</p>'
  '<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f0f4ff,#faf0ff);border-radius:12px;border:1.5px solid #e0d7ff;margin:20px 0;">'
  '<tr><td style="padding:26px 28px;">'
  '<p style="margin:0 0 14px;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">&#128196; D&eacute;tails de la facture</p>'
  '<table width="100%" cellpadding="0" cellspacing="0">'
  '<tr><td style="color:#374151;font-size:15px;padding:6px 0;">R&eacute;f&eacute;rence</td><td align="right" style="color:#4f46e5;font-weight:600;font-size:15px;">#INV-2026-0831</td></tr>'
  '<tr><td style="color:#374151;font-size:15px;padding:6px 0;">Date d&rsquo;&eacute;mission</td><td align="right" style="color:#374151;font-size:15px;">31 ao&ucirc;t 2026</td></tr>'
  '<tr><td style="color:#374151;font-size:15px;padding:6px 0;">Ech&eacute;ance</td><td align="right" style="color:#ef4444;font-weight:600;font-size:15px;">7 sept. 2026</td></tr>'
  '<tr><td colspan="2" style="border-top:1.5px dashed #c4b5fd;padding:10px 0 2px;"></td></tr>'
  '<tr><td style="color:#111827;font-size:17px;font-weight:700;">Total</td>'
  '<td align="right" style="color:#4f46e5;font-size:22px;font-weight:800;">250,00 CAD</td></tr>'
  '</table></td></tr></table>'
  '<table width="100%" cellpadding="0" cellspacing="0">'
  '<tr><td align="center" style="padding:20px 0 32px;">'
  '<a href="#" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 44px;border-radius:50px;box-shadow:0 4px 15px rgba(102,126,234,.45);">&#128179;&#160;&#160;Payer ma facture</a>'
  '</td></tr></table>'
  '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;line-height:1.7;">Des questions&#160;? R&eacute;pondez simplement &agrave; cet email &#128522;</p>'
  '</td></tr>'
  '<tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:22px 40px;text-align:center;">'
  '<p style="margin:0 0 4px;color:#9ca3af;font-size:13px;">Merci de votre confiance &#128156;</p>'
  '<p style="margin:0;color:#d1d5db;font-size:12px;">Si vous avez d&eacute;j&agrave; pay&eacute;, veuillez ignorer ce message.</p>'
  '</td></tr>'
  '</table></td></tr></table></div>'
)

lines = [
  'import json',
  'import requests',
  'import sys',
  '',
  f'AUTH_TOKEN = "{auth}"',
  f'XSRF_TOKEN = "{xsrf}"',
  f'COOKIE = "{cookie}"',
  '',
  f'FIELD_ID = "{fid}"',
  f'CONVERSATION_ID = "{cid}"',
  f'CHANNEL_UID = "{chuid}"',
  '',
  f'PUT_URL  = f"https://api2.myclients.io/platform/v1/fields/{{FIELD_ID}}?teams_view_filter=%7B%7D"',
  f'POST_URL = f"https://api2.myclients.io/v2/conversations/{{CONVERSATION_ID}}/messages?teams_view_filter=%7B%7D"',
  '',
  'BASE_HEADERS = {',
  '    "accept": "application/json, text/plain, */*",',
  '    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",',
  '    "authorization": f"Bearer {AUTH_TOKEN}",',
  '    "content-type": "application/json;charset=UTF-8",',
  '    "cookie": COOKIE,',
  '    "origin": "https://app.vcita.com",',
  '    "referer": "https://app.vcita.com/",',
  "    \"sec-ch-ua\": '\"Not=A?Brand\";v=\"99\", \"Google Chrome\";v=\"151\", \"Chromium\";v=\"151\"',",
  '    "sec-ch-ua-mobile": "?0",',
  "    \"sec-ch-ua-platform\": '\"Windows\"',",
  '    "sec-fetch-dest": "empty",',
  '    "sec-fetch-mode": "cors",',
  '    "sec-fetch-site": "cross-site",',
  '    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",',
  '    "x-app-name": "Frontage",',
  '    "x-mobile-app": "false",',
  '    "x-xsrf-token": XSRF_TOKEN,',
  '}',
  '',
  f'DEFAULT_HTML = {repr(html)}',
  '',
  '',
  'def update_email(new_email):',
  '    payload = {',
  '        "id": FIELD_ID,',
  '        "type": "email",',
  '        "label": new_email,',
  '        "required": True,',
  '        "default_value": "",',
  '        "deleted": False,',
  '        "enforce_opt_in": None,',
  '        "forms": ["client_card", "online_payments", "leave_details", "share_documents", "scheduling"],',
  '        "icon": "icon-Mail",',
  '        "icon_dark": "icon-envelop-fill-16",',
  '        "keep_asking": False,',
  '        "object_type": "contact",',
  '        "selectedValue": "Email"',
  '    }',
  '    r = requests.put(PUT_URL, headers=BASE_HEADERS, json=payload)',
  '    print(f"PUT /fields  - {r.status_code}")',
  '    print("Email OK" if r.status_code == 200 else f"Erreur: {r.text}")',
  '    return r',
  '',
  '',
  'def send_message(message_text):',
  '    payload = {',
  '        "text": message_text,',
  '        "channels": ["email"],',
  '        "channel_uid": CHANNEL_UID',
  '    }',
  '    r = requests.post(POST_URL, headers=BASE_HEADERS, json=payload)',
  '    print(f"POST /messages - {r.status_code}")',
  '    print("Message envoye !" if r.status_code == 200 else f"Erreur: {r.text}")',
  '    return r',
  '',
  '',
  'def main():',
  '    if len(sys.argv) < 2:',
  '        print("Usage: python sendit.py <email> [message_html]")',
  '        sys.exit(1)',
  '    email = sys.argv[1]',
  '    message = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_HTML',
  '    print(f"Email -> {email}")',
  '    update_email(email)',
  '    print("Envoi du message HTML...")',
  '    send_message(message)',
  '',
  '',
  'if __name__ == "__main__":',
  '    main()',
]

with open('sendit.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

print('OK - sendit.py ecrit')
