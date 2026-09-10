import requests
import urllib.parse
import json
import re

# Premier compte du CSV
USERNAME = "d4rkst4r17@hotmail.com"
PASSWORD = "Fuck1989@@"

DEVICE_FP = "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;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"
KOUNT_SID = "d33c301703204958a631b1b3eb0dd9f4"

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Referer": "https://my.equifax.ca/login",
    "Origin": "https://my.equifax.ca",
    "Sec-Ch-Ua": '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
})

# Step 1: GET login page
print("=== STEP 1: GET /login ===")
r = session.get("https://my.equifax.ca/login", timeout=15)
print(f"Status: {r.status_code}")
print(f"URL: {r.url}")
print(f"Cookies: {dict(session.cookies)}")
print()

# Step 2: POST validateCredentials
print("=== STEP 2: POST /validateCredentials ===")
r = session.post(
    "https://my.equifax.ca/membercenter/validateCredentials",
    data={
        "username": USERNAME,
        "password": PASSWORD,
        "deviceFingerprint": DEVICE_FP,
        "kountSessionId": KOUNT_SID,
    },
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    timeout=15,
)
print(f"Status: {r.status_code}")
print(f"URL: {r.url}")
print(f"Headers: {dict(r.headers)}")
print(f"Cookies apres login: {dict(session.cookies)}")
print()

# Analyser la reponse
print("=== REPONSE BODY ===")
body = r.text
print(f"Taille: {len(body)} chars")
print(f"Content-Type: {r.headers.get('Content-Type', 'N/A')}")
print()

# Essayer JSON
try:
    data = r.json()
    print("=== JSON PARSE OK ===")
    print(json.dumps(data, indent=2, ensure_ascii=False)[:2000])
except:
    print("=== PAS DU JSON, CONTENU BRUT ===")
    print(body[:2000])
print()

# Step 3: Essayer plusieurs endpoints apres login
endpoints = [
    ("GET", "/membercenter/app/data/account/v1/account-summary", {"Accept": "application/json"}),
    ("GET", "/credit-report/personal-info", {"Accept": "text/html"}),
    ("GET", "/membercenter/app/data/product/one_b_adhoc_report/v1/credit-report", {"Accept": "application/json"}),
    ("GET", "/membercenter/home", {"Accept": "text/html"}),
]

for method, path, extra_headers in endpoints:
    full_url = f"https://my.equifax.ca{path}"
    print(f"=== {method} {path} ===")
    try:
        if method == "GET":
            r2 = session.get(full_url, headers=extra_headers, timeout=15, allow_redirects=True)
        print(f"Status: {r2.status_code}")
        print(f"URL finale: {r2.url}")
        print(f"Content-Type: {r2.headers.get('Content-Type', 'N/A')}")
        ct = r2.headers.get("Content-Type", "")
        if "json" in ct:
            try:
                d = r2.json()
                print(json.dumps(d, indent=2, ensure_ascii=False)[:1000])
            except:
                print(r2.text[:500])
        else:
            print(r2.text[:500])
    except Exception as e:
        print(f"Erreur: {e}")
    print()
