import requests
import re
import time

COOKIES = {
    "PHPSESSID":        "4d7fhblthnibi8cq0kdg32d6bi",
    "samu":             "1d881ddab02f15047fc38b931844576bc416853ea%3A5%3A%7Bi%3A0%3BO%3A7%3A%22MongoId%22%3A1%3A%7Bs%3A8%3A%22objectID%22%3Bs%3A24%3A%226a8b9867b5df2774b40b3747%22%3B%7Di%3A1%3Bs%3A11%3A%22moufa%20sarim%22%3Bi%3A2%3Bi%3A2592000%3Bi%3A3%3Ba%3A2%3A%7Bs%3A9%3A%22loginType%22%3Bs%3A8%3A%22customer%22%3Bs%3A9%3A%22ipAddress%22%3Bs%3A14%3A%2272.139.194.109%22%3B%7Di%3A4%3BO%3A7%3A%22MongoId%22%3A1%3A%7Bs%3A8%3A%22objectID%22%3Bs%3A24%3A%226a8b986aaab30a3715056888%22%3B%7D%7D",
    "cLog":             "6a8b9867b5df2774b40b3747",
    "V5SID_InfoTracer": "ba1mk9pcaggdk1742b31iq6ph9",
    "themeVersion":     "V2",
    "lCountry":         "ca",
    "advanced-frontend":"61abec273a53b34255a61a4c8af7d1b8",
}

s = requests.Session()
s.headers.update({
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "origin": "https://members.infotracer.com",
    "referer": "https://members.infotracer.com/customer/index?name=people&id=5806432ca6a9df9e07a5e8a0",
    "content-type": "application/x-www-form-urlencoded",
})
s.cookies.update(COOKIES)

numero = "8196352484"

print(f"Test POST pour {numero}...")
r = s.post("https://members.infotracer.com/customer/search", data={
    "phone": numero,
    "mercSearchTypeId": "5806432ca6a9df9e07a5e8a0",
    "reportType": "all"
}, timeout=30)

print(f"Status: {r.status_code}")
print(f"URL finale: {r.url}")
print(f"Longueur HTML: {len(r.text)}")
print()

# Chercher custSearchId
m = re.search(r"SearchLoader\s*\(\s*['\"]([a-f0-9]{24})['\"]", r.text)
if m:
    print(f"custSearchId: {m.group(1)}")
else:
    print("custSearchId: NON TROUVE")

print()
print("=== TITRE PAGE ===")
mt = re.search(r"<title>(.*?)</title>", r.text, re.IGNORECASE | re.DOTALL)
print(mt.group(1).strip() if mt else "Aucun titre")

print()
print("=== SCRIPTS INLINE ===")
for sc in re.findall(r"<script[^>]*>(.*?)</script>", r.text, re.DOTALL):
    sc = sc.strip()
    if sc and len(sc) < 500:
        print(repr(sc[:300]))
        print("---")

print()
print("=== DEBUT HTML (1500 chars) ===")
print(r.text[:1500])
