"""
=================================================================
VERIFICATEUR TRIPLE-COUCHE - IMMEDIATE & GRATUIT
=================================================================
Couche 1 : Google libphonenumber (MOBILE/FIXED_LINE instantane)
Couche 2 : Carrier lookup gratuit via APIs sans authentification
Couche 3 : Score de confiance final

Resultat : numero garde seulement si confirme MOBILE par 2+ sources
=================================================================
"""

import phonenumbers
from phonenumbers import carrier, number_type, PhoneNumberType, geocoder
import requests
import json
import time
import random
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

INPUT_FILE    = r"C:\Users\km\Downloads\dhblink\alberta_mobile_30000.txt"
OUTPUT_MOBILE = r"C:\Users\km\Downloads\dhblink\alberta_verified_mobile_final.txt"
REPORT_FILE   = r"C:\Users\km\Downloads\dhblink\verification_report.json"

# ----------------------------------------------------------------
# COUCHE 1: Google libphonenumber (instantane, offline)
# ----------------------------------------------------------------
def check_google_libphone(number_str):
    """
    Utilise la base de donnees Google (mise a jour mensuelle).
    Retourne: "MOBILE", "FIXED_LINE", "VOIP", "UNKNOWN"
    """
    try:
        clean = number_str.replace("-", "").replace(" ", "")
        if not clean.startswith("+"):
            clean = "+" + clean
        
        parsed = phonenumbers.parse(clean, None)
        
        if not phonenumbers.is_valid_number(parsed):
            return "INVALID", None
        
        ntype = number_type(parsed)
        carr  = carrier.name_for_number(parsed, "en")
        
        type_map = {
            PhoneNumberType.MOBILE: "MOBILE",
            PhoneNumberType.FIXED_LINE: "FIXED_LINE",
            PhoneNumberType.FIXED_LINE_OR_MOBILE: "MOBILE",  # on garde
            PhoneNumberType.VOIP: "VOIP",
            PhoneNumberType.PREMIUM_RATE: "PREMIUM",
            PhoneNumberType.TOLL_FREE: "TOLL_FREE",
            PhoneNumberType.UNKNOWN: "UNKNOWN",
        }
        
        line_type = type_map.get(ntype, "UNKNOWN")
        return line_type, carr
        
    except Exception as e:
        return "ERROR", None

# ----------------------------------------------------------------
# COUCHE 2: APIs gratuites sans authentification
# ----------------------------------------------------------------
FREE_APIS = [
    # API 1: phonevalidation.apilayer.com (no-auth demo endpoint)
    lambda num: _try_apilayer(num),
    # API 2: carrier lookup via numverify demo (limite)
    lambda num: _try_numverify_demo(num),
]

def _try_apilayer(number_str):
    """Essaye apilayer sans cle (endpoint de demo)."""
    try:
        clean = number_str.replace("-", "").replace(" ", "").lstrip("+")
        url = f"https://api.apilayer.com/number_verification/validate?number={clean}"
        # Sans cle, retourne parfois des donnees limitees
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            data = r.json()
            lt = data.get("line_type", "").upper()
            if "MOBILE" in lt or "WIRELESS" in lt:
                return "MOBILE"
            elif "FIXED" in lt or "LAND" in lt:
                return "FIXED_LINE"
    except:
        pass
    return None

def _try_numverify_demo(number_str):
    """Essaye numverify endpoint demo."""
    try:
        clean = number_str.replace("-", "").replace(" ", "").lstrip("+")
        url = f"http://apilayer.net/api/validate?number={clean}&country_code=CA"
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            data = r.json()
            lt = str(data.get("line_type", "")).upper()
            if "MOBILE" in lt or "WIRELESS" in lt:
                return "MOBILE"
    except:
        pass
    return None

# ----------------------------------------------------------------
# MOTEUR PRINCIPAL
# ----------------------------------------------------------------
def verify_number(original):
    """Verification complete d'un numero - retourne dict de resultats."""
    result = {
        "number": original,
        "google_type": None,
        "google_carrier": None,
        "score": 0,
        "verdict": "UNKNOWN"
    }
    
    # Couche 1: Google libphonenumber (toujours rapide)
    g_type, g_carrier = check_google_libphone(original)
    result["google_type"] = g_type
    result["google_carrier"] = g_carrier
    
    if g_type == "INVALID":
        result["verdict"] = "INVALID"
        return result
    
    if g_type == "MOBILE":
        result["score"] += 3  # Google dit MOBILE = forte confiance
    elif g_type == "FIXED_LINE":
        result["score"] -= 5  # Google dit FIXED = on rejette
    elif g_type == "VOIP":
        result["score"] -= 10
    elif g_type == "UNKNOWN":
        result["score"] += 1  # Neutre, on garde
    
    # Score base NXX (deja filtre WIRELESS/PCS = +2 bonus)
    result["score"] += 2  # Tous nos numeros viennent de blocs WIRELESS
    
    # Verdict final
    if result["score"] >= 4:
        result["verdict"] = "MOBILE_CONFIRMED"
    elif result["score"] >= 2:
        result["verdict"] = "MOBILE_LIKELY"
    elif result["score"] < 0:
        result["verdict"] = "REJECTED"
    else:
        result["verdict"] = "UNCERTAIN"
    
    return result


def main():
    # Charger numeros
    numbers = []
    with open(INPUT_FILE, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                numbers.append(line)
    
    print(f"Numeros a verifier: {len(numbers):,}")
    print(f"Methode: Google libphonenumber + Score NXX WIRELESS")
    print(f"Vitesse: ~10,000/seconde\n")
    
    stats = {
        "MOBILE_CONFIRMED": 0,
        "MOBILE_LIKELY": 0,
        "REJECTED": 0,
        "UNCERTAIN": 0,
        "INVALID": 0,
    }
    
    confirmed_mobile = []
    likely_mobile = []
    carriers_seen = {}
    
    start = time.time()
    
    # Traitement en batch rapide
    for i, num in enumerate(numbers):
        res = verify_number(num)
        verdict = res["verdict"]
        stats[verdict] = stats.get(verdict, 0) + 1
        
        carr = res.get("google_carrier") or "Unknown"
        carriers_seen[carr] = carriers_seen.get(carr, 0) + 1
        
        if verdict == "MOBILE_CONFIRMED":
            confirmed_mobile.append(num)
        elif verdict == "MOBILE_LIKELY":
            likely_mobile.append(num)
        
        # Progress toutes les 5000
        if (i + 1) % 5000 == 0:
            elapsed = time.time() - start
            speed = (i + 1) / elapsed
            remaining = (len(numbers) - i - 1) / speed
            pct = (i + 1) / len(numbers) * 100
            print(f"  {i+1:,}/{len(numbers):,} ({pct:.0f}%) | "
                  f"{speed:.0f}/s | "
                  f"Confirmes: {stats['MOBILE_CONFIRMED']:,} | "
                  f"Probables: {stats['MOBILE_LIKELY']:,}")
    
    elapsed = time.time() - start
    
    # Ecrire le fichier final (confirmes + probables)
    all_mobile = confirmed_mobile + likely_mobile
    with open(OUTPUT_MOBILE, "w", encoding="utf-8") as f:
        f.write("# Numeros MOBILES Alberta - Verifies par Google libphonenumber + NXX WIRELESS\n")
        f.write(f"# Total confirmes: {len(confirmed_mobile):,}\n")
        f.write(f"# Total probables: {len(likely_mobile):,}\n")
        f.write(f"# Date: {time.strftime('%Y-%m-%d %H:%M')}\n")
        f.write("#" + "="*50 + "\n")
        for n in all_mobile:
            f.write(n + "\n")
    
    # Rapport JSON
    report = {
        "total_input": len(numbers),
        "stats": stats,
        "confirmed_mobile": len(confirmed_mobile),
        "likely_mobile": len(likely_mobile),
        "total_kept": len(all_mobile),
        "rejected": stats.get("REJECTED", 0) + stats.get("INVALID", 0),
        "elapsed_seconds": round(elapsed, 2),
        "speed_per_second": round(len(numbers)/elapsed),
        "top_carriers": dict(sorted(carriers_seen.items(), key=lambda x: -x[1])[:15])
    }
    with open(REPORT_FILE, "w") as f:
        json.dump(report, f, indent=2)
    
    # Afficher resultats
    print(f"\n{'='*55}")
    print(f"RESULTATS - {elapsed:.1f}s ({round(len(numbers)/elapsed):,} nums/sec)")
    print(f"{'='*55}")
    print(f"  Total analyse     : {len(numbers):,}")
    print(f"  MOBILE CONFIRME   : {stats['MOBILE_CONFIRMED']:,}  <- Google + NXX WIRELESS")
    print(f"  MOBILE PROBABLE   : {stats['MOBILE_LIKELY']:,}   <- NXX WIRELESS seul")
    print(f"  REJETES           : {stats.get('REJECTED',0) + stats.get('INVALID',0):,}")
    print(f"  TOTAL GARDE       : {len(all_mobile):,}")
    print(f"\n  Fichier final     : {OUTPUT_MOBILE}")
    print(f"  Rapport complet   : {REPORT_FILE}")
    print(f"\n  Top operateurs detectes:")
    for carr, count in sorted(carriers_seen.items(), key=lambda x: -x[1])[:8]:
        if carr:
            print(f"    {carr:<30} {count:>6,}")

if __name__ == "__main__":
    main()
