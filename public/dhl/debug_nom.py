import requests
from bs4 import BeautifulSoup
import re
import time

session = requests.Session()
session.headers.update({
    "user-agent":    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
    "accept":        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "origin":        "https://members.infotracer.com",
    "referer":       "https://members.infotracer.com/customer/index?name=people&id=5806432ca6a9df9e07a5e8a0",
})
session.cookies.update({
    "PHPSESSID":        "4d7fhblthnibi8cq0kdg32d6bi",
    "samu":             "1d881ddab02f15047fc38b931844576bc416853ea%3A5%3A%7Bi%3A0%3BO%3A7%3A%22MongoId%22%3A1%3A%7Bs%3A8%3A%22objectID%22%3Bs%3A24%3A%226a8b9867b5df2774b40b3747%22%3B%7Di%3A1%3Bs%3A11%3A%22moufa%20sarim%22%3Bi%3A2%3Bi%3A2592000%3Bi%3A3%3Ba%3A2%3A%7Bs%3A9%3A%22loginType%22%3Bs%3A8%3A%22customer%22%3Bs%3A9%3A%22ipAddress%22%3Bs%3A14%3A%2272.139.194.109%22%3B%7Di%3A4%3BO%3A7%3A%22MongoId%22%3A1%3A%7Bs%3A8%3A%22objectID%22%3Bs%3A24%3A%226a8b986aaab30a3715056888%22%3B%7D%7D",
    "cLog":             "6a8b9867b5df2774b40b3747",
    "V5SID_InfoTracer": "ba1mk9pcaggdk1742b31iq6ph9",
    "themeVersion":     "V2",
    "lCountry":         "ca",
    "advanced-frontend":"61abec273a53b34255a61a4c8af7d1b8",
})

BASE_URL = "https://members.infotracer.com"
numero   = "8196352484"

# POST
session.headers["content-type"] = "application/x-www-form-urlencoded"
r = session.post(BASE_URL + "/customer/search", data={
    "phone": numero,
    "mercSearchTypeId": "5806432ca6a9df9e07a5e8a0",
    "reportType": "all"
}, timeout=30)

m = re.search(r"SearchLoader\s*\(\s*['\"]([a-f0-9]{24})['\"]", r.text)
if not m:
    print("custSearchId non trouve")
    exit()

cid = m.group(1)
print(f"custSearchId: {cid}")

# Poll
for i in range(20):
    time.sleep(2)
    sr = session.get(BASE_URL + "/customer/searchStatus",
                     params={"custSearchId": cid},
                     headers={"accept": "application/json", "x-requested-with": "XMLHttpRequest"})
    data = sr.json()
    print(f"  poll {i+1}: status={data.get('status')}")
    if data.get("status") == 303:
        loc = data["location"]
        rr = session.get(BASE_URL + loc, timeout=30)
        soup = BeautifulSoup(rr.text, "html.parser")

        print("\n=== TOUS LES TEXTES DE LA PAGE ===")
        for t in soup.stripped_strings:
            t = t.strip()
            if len(t) > 2:
                print(repr(t))

        print("\n=== H1/H2/H3 ===")
        for tag in ["h1","h2","h3"]:
            for e in soup.find_all(tag):
                print(f"{tag}: {repr(e.get_text(strip=True))}")

        print("\n=== DIVS AVEC CLASSE ===")
        for div in soup.find_all(["div","span","p"], class_=True):
            cls = " ".join(div.get("class",[]))
            txt = div.get_text(strip=True)
            if txt and len(txt) < 150:
                print(f"[{cls}]: {repr(txt)}")
        break
    elif data.get("status") in [404,403,204,500]:
        print("Fin:", data)
        break
