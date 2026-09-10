import json
import requests
import sys

AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJlbnRpdHlfdWlkIjoiZHZ3NjFka202OHRkNnNsZCIsImV4dHJhIjp7ImJ1c2luZXNzX3VpZCI6IjJpYWRrbmh5a2I5bG11dTciLCJyZWZyZXNoX3Rva2VuX2lkIjoiZjgxOWVkMDg2YzA0YmQ4YjI0NDA4YTlhYzJjZTIzMTcifSwiZXhwIjoxNzg4MTUwNjIxLCJyZWZyZXNoIjoxNzg4MTUwNDQxLCJjcmVhdGVkIjoxNzg4MTQ5NzIxLCJ0eXBlIjoic3RhZmYiLCJqdGkiOiJmNmNlM2RmNmI1MTBjMjkzYjY4MjM1ZDljOWQ3OTgzYWEwNTdiMmE2ODIwMWQyOTM4YWRhZmZkNjI2YzM5NDQzIn0.NltTlnHhUVh-7FRMPSGqwoALMwNgVZYhht5uVN43-HU"
XSRF_TOKEN = "Yjw4d1oID/DBL/mBTeb3SwzQQE64/B+RVb9rPO8gFcOwjY9C8+m+MCsRrhy+zgVckiQecleAUmml5GZAnwE6vA=="
COOKIE = "__cf_bm=VqdlzSaa0HJDdGuoCBl3bpLfMImjhPvy8PH2HlP5ncY-1788149552.3544064-1.0.1.1-HvbzETvdCKk4MqQsNYLMrU3NUV72fMKqEJSVO5CAyY_iVuO2wfhoApRdQnwgvHQ1Cu8FyMoGMsIyNTFdL3I0q5cZ85uB_I5REQ9E8ywlftPWFCWLbfMGwlojqH4naKERzXM0WJgayNnOaHZecBJbbQ"

FIELD_ID        = "6o5v1iyil8xf3r6e"
CONVERSATION_ID = "1x4os6i6pucncse3"
CHANNEL_UID     = "dujrmr24hpmerwkr"

PUT_URL  = f"https://api2.myclients.io/platform/v1/fields/{FIELD_ID}?teams_view_filter=%7B%7D"
POST_URL = f"https://api2.myclients.io/v2/conversations/{CONVERSATION_ID}/messages?teams_view_filter=%7B%7D"

BASE_HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "authorization": f"Bearer {AUTH_TOKEN}",
    "content-type": "application/json;charset=UTF-8",
    "cookie": COOKIE,
    "origin": "https://app.vcita.com",
    "referer": "https://app.vcita.com/",
    "sec-ch-ua": '"Not=A?Brand";v="99", "Google Chrome";v="151", "Chromium";v="151"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "x-app-name": "Frontage",
    "x-mobile-app": "false",
    "x-xsrf-token": XSRF_TOKEN,
}

DEFAULT_HTML = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background-color:#f2f4f7;"><table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f2f4f7" style="background-color:#f2f4f7;padding:30px 0;"><tr><td align="center"><table width="560" border="0" cellpadding="0" cellspacing="0" style="max-width:560px;"><tr><td align="center" bgcolor="#5b4fcf" style="background-color:#5b4fcf;padding:36px 40px 28px;border-radius:12px 12px 0 0;"><p style="margin:0 0 8px 0;font-size:34px;line-height:1;">&#128156;</p><h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">Votre facture vous attend !</h1><p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#d0c9ff;line-height:1.5;">Un petit rappel tout doux de notre part</p></td></tr><tr><td bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 40px 28px;"><p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Bonjour &#128522;,</p><p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;line-height:1.7;">Nous vous contactons car <strong style="color:#5b4fcf;">une facture est actuellement en attente</strong> de votre r&egrave;glement. Pas d&rsquo;inqui&eacute;tude, c&rsquo;est rapide et s&eacute;curis&eacute; &#128274;</p><table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f6f4ff" style="background-color:#f6f4ff;border-radius:8px;border:2px solid #ddd6fe;margin-bottom:24px;"><tr><td style="padding:22px 24px;"><p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#7c6fc7;text-transform:uppercase;letter-spacing:1.2px;">&#128196; D&eacute;tails de la facture</p><table width="100%" border="0" cellpadding="5" cellspacing="0"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b7280;">R&eacute;f&eacute;rence</td><td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#5b4fcf;">#INV-2026-0831</td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b7280;">Date d&rsquo;&eacute;mission</td><td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;">31 ao&ucirc;t 2026</td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b7280;">Date d&rsquo;&eacute;ch&eacute;ance</td><td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#dc2626;">7 septembre 2026</td></tr><tr><td colspan="2" style="padding:8px 0 4px;"><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px dashed #c4b5fd;font-size:1px;line-height:1px;">&nbsp;</td></tr></table></td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:700;color:#111827;padding-top:4px;">Montant total</td><td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;color:#5b4fcf;padding-top:4px;">250,00 $CAD</td></tr></table></td></tr></table><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 28px;"><table border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#5b4fcf" style="background-color:#5b4fcf;border-radius:30px;padding:0;"><a href="#" style="display:block;padding:15px 40px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;white-space:nowrap;">&#128179; &nbsp;Payer ma facture maintenant</a></td></tr></table></td></tr></table><p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9ca3af;line-height:1.6;">Des questions ? R&eacute;pondez simplement &agrave; cet email, nous sommes l&agrave; pour vous &#128522;</p></td></tr><tr><td align="center" bgcolor="#ede9ff" style="background-color:#ede9ff;padding:20px 40px;border-radius:0 0 12px 12px;"><p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;color:#7c6fc7;">Merci de votre confiance &#128156;</p><p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#a89fd4;">Si vous avez d&eacute;j&agrave; effectu&eacute; votre paiement, veuillez ignorer ce message.</p></td></tr></table></td></tr></table></body></html>'


def update_email(new_email):
    payload = {
        "id": FIELD_ID,
        "type": "email",
        "label": new_email,
        "required": True,
        "default_value": "",
        "deleted": False,
        "enforce_opt_in": None,
        "forms": ["client_card", "online_payments", "leave_details", "share_documents", "scheduling"],
        "icon": "icon-Mail",
        "icon_dark": "icon-envelop-fill-16",
        "keep_asking": False,
        "object_type": "contact",
        "selectedValue": "Email",
    }
    r = requests.put(PUT_URL, headers=BASE_HEADERS, json=payload)
    print(f"PUT /fields  - {r.status_code}")
    print("Email OK" if r.status_code == 200 else f"Erreur: {r.text}")
    return r


def send_message(message_text):
    payload = {
        "body": message_text,
        "channels": ["email"],
        "channel_uid": CHANNEL_UID,
    }
    r = requests.post(POST_URL, headers=BASE_HEADERS, json=payload)
    print(f"POST /messages - {r.status_code}")
    print("Message envoye !" if r.status_code == 200 else f"Erreur: {r.text}")
    return r


def main():
    if len(sys.argv) < 2:
        print("Usage: python sendit.py <email> [message_html]")
        sys.exit(1)
    email   = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_HTML
    print(f"Email -> {email}")
    update_email(email)
    print("Envoi du message HTML...")
    send_message(message)


if __name__ == "__main__":
    main()
