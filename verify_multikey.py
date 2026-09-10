"""
=================================================================
VERIFICATEUR MASSIF - STRATEGIE MULTI-COMPTES PARALLELES
=================================================================
1. Cree des emails jetables via mail.tm (gratuit, API publique)
2. S'inscrit automatiquement sur Veriphone.io (1000 verif/compte)
3. Lance 30 verifications en parallele = 30 000 numeros verifies
4. Resultat: fichier avec uniquement les vrais mobiles confirmes
=================================================================

NOTE: Veriphone.io retourne:
  - line_type: "mobile"    -> MOBILE confirme
  - line_type: "landline"  -> FIXE -> exclure
  - line_type: "voip"      -> VoIP -> exclure
  - is_valid: true/false
  - carrier: nom operateur
=================================================================

USAGE: python verify_multikey.py --keys KEY1,KEY2,KEY3,...
  OU:  python verify_multikey.py --auto (cree les comptes auto)
"""

import requests
import json
import time
import random
import threading
import os
import sys
import string
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# ----------------------------------------------------------------
# CONFIG
# ----------------------------------------------------------------
INPUT_FILE    = r"C:\Users\km\Downloads\dhblink\alberta_mobile_30000.txt"
OUTPUT_FILE   = r"C:\Users\km\Downloads\dhblink\alberta_VERIFIED_mobile.txt"
REJECTED_FILE = r"C:\Users\km\Downloads\dhblink\alberta_rejected.txt"
PROGRESS_FILE = r"C:\Users\km\Downloads\dhblink\verify_progress.json"
KEYS_FILE     = r"C:\Users\km\Downloads\dhblink\veriphone_keys.txt"

VERIPHONE_API = "https://api.veriphone.io/v2/verify"
MAILTM_API    = "https://api.mail.tm"
VERIPHONE_REG = "https://veriphone.io/auth/register"

MAX_WORKERS   = 10   # Threads paralleles
DELAY_MIN     = 0.5  # Secondes entre appels par thread
DELAY_MAX     = 1.2

headers_base = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    'Accept': 'application/json',
}

# ----------------------------------------------------------------
# ETAPE 1: Creer emails jetables via mail.tm
# ----------------------------------------------------------------
def create_temp_email():
    """Cree un email jetable via mail.tm API."""
    try:
        # Obtenir domaine disponible
        r = requests.get(f"{MAILTM_API}/domains", timeout=10)
        domain = r.json()['hydra:member'][0]['domain']
        
        # Creer compte
        username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))
        password = ''.join(random.choices(string.ascii_letters + string.digits + '!@#$', k=16))
        email = f"{username}@{domain}"
        
        r = requests.post(
            f"{MAILTM_API}/accounts",
            json={"address": email, "password": password},
            timeout=10
        )
        
        if r.status_code in (200, 201):
            # Obtenir token JWT
            r2 = requests.post(
                f"{MAILTM_API}/token",
                json={"address": email, "password": password},
                timeout=10
            )
            jwt = r2.json().get('token', '')
            return email, password, jwt
        return None, None, None
    except Exception as e:
        print(f"  [mail.tm] Erreur: {e}")
        return None, None, None

def get_email_messages(jwt_token):
    """Recupere les emails recus."""
    try:
        r = requests.get(
            f"{MAILTM_API}/messages",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=10
        )
        return r.json().get('hydra:member', [])
    except:
        return []

# ----------------------------------------------------------------
# ETAPE 2: S'inscrire sur Veriphone et recuperer la cle API
# ----------------------------------------------------------------
def register_veriphone(email, password):
    """
    S'inscrit sur Veriphone.io et recupere la cle API.
    Retourne la cle API ou None si echec.
    """
    session = requests.Session()
    session.headers.update(headers_base)
    
    try:
        # Page d'inscription
        r = session.get("https://veriphone.io/auth/register", timeout=10)
        
        # Extraire les tokens CSRF si presents
        import re
        csrf = re.search(r'name="_token"\s+value="([^"]+)"', r.text)
        csrf_token = csrf.group(1) if csrf else ''
        
        # Soumettre le formulaire d'inscription
        data = {
            '_token': csrf_token,
            'name': f"User{random.randint(1000,9999)}",
            'email': email,
            'password': password,
            'password_confirmation': password,
        }
        
        r2 = session.post(
            "https://veriphone.io/auth/register",
            data=data,
            timeout=15,
            allow_redirects=True
        )
        
        if r2.status_code == 200 or 'dashboard' in r2.url:
            # Aller sur le dashboard pour recuperer la cle
            r3 = session.get("https://veriphone.io/dashboard", timeout=10)
            
            # Extraire la cle API
            key_match = re.search(
                r'(?:api[_\s]?key|your[_\s]?key|API Key)[^:]*:\s*([A-Z0-9]{32,})',
                r3.text, re.I
            )
            if not key_match:
                # Chercher dans le format texte
                key_match = re.search(r'[A-Z0-9]{32,}', r3.text)
            
            if key_match:
                return key_match.group(1) if key_match.lastindex else key_match.group(0)
        
        return None
    except Exception as e:
        print(f"  [Veriphone reg] Erreur: {e}")
        return None

# ----------------------------------------------------------------
# ETAPE 3: Verification via Veriphone API
# ----------------------------------------------------------------
def verify_number_veriphone(number, api_key):
    """
    Verifie un numero via l'API Veriphone.
    Retourne dict avec line_type, carrier, is_valid
    """
    try:
        clean = number.replace("-", "").replace(" ", "")
        if not clean.startswith("+"):
            clean = "+" + clean
        
        r = requests.get(
            VERIPHONE_API,
            params={'phone': clean, 'key': api_key},
            headers=headers_base,
            timeout=10
        )
        
        if r.status_code == 200:
            data = r.json()
            return {
                'number': number,
                'valid': data.get('status') == 'success' and data.get('phone_valid'),
                'line_type': data.get('phone_type', 'unknown').lower(),
                'carrier': data.get('carrier', ''),
                'country': data.get('country', ''),
                'raw': data
            }
        elif r.status_code == 429:
            return {'error': 'rate_limit'}
        elif r.status_code == 401:
            return {'error': 'invalid_key'}
        else:
            return {'error': f'http_{r.status_code}'}
    except Exception as e:
        return {'error': str(e)}

# ----------------------------------------------------------------
# MOTEUR PRINCIPAL - Verification avec cles multiples
# ----------------------------------------------------------------
def load_numbers():
    nums = []
    with open(INPUT_FILE, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                nums.append(line)
    return nums

def load_keys():
    """Charge les cles depuis le fichier ou les args."""
    if '--keys' in sys.argv:
        idx = sys.argv.index('--keys')
        return sys.argv[idx+1].split(',')
    if Path(KEYS_FILE).exists():
        with open(KEYS_FILE) as f:
            return [k.strip() for k in f.readlines() if k.strip()]
    return []

def load_progress():
    if Path(PROGRESS_FILE).exists():
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {'done': set(), 'mobile': [], 'rejected': []}

def save_progress(prog):
    prog_save = {
        'done': list(prog['done']),
        'mobile': prog['mobile'],
        'rejected': prog['rejected']
    }
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(prog_save, f)

def worker(chunk, api_key, result_lock, progress, stats):
    """Thread worker: verifie un chunk de numeros avec une cle."""
    local_mobile = []
    local_rejected = []
    key_exhausted = False
    
    for num in chunk:
        if key_exhausted:
            break
        if num in progress['done']:
            continue
        
        result = verify_number_veriphone(num, api_key)
        
        if 'error' in result:
            if result['error'] in ('rate_limit', 'invalid_key'):
                key_exhausted = True
                print(f"\n  [KEY EXPIRED] {api_key[:8]}... -> Exhausted")
                break
            time.sleep(2)
            continue
        
        line_type = result.get('line_type', 'unknown')
        is_mobile = line_type in ('mobile', 'mobile (mms capable)')
        carrier = result.get('carrier', '')
        
        with result_lock:
            progress['done'].add(num)
            stats['total'] += 1
            
            if is_mobile:
                stats['mobile'] += 1
                local_mobile.append(num)
                progress['mobile'].append(num)
            else:
                stats['rejected'] += 1
                local_rejected.append((num, line_type, carrier))
                progress['rejected'].append(num)
        
        delay = random.uniform(DELAY_MIN, DELAY_MAX)
        time.sleep(delay)
    
    # Ecrire les resultats immediatement
    with result_lock:
        if local_mobile:
            with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
                for n in local_mobile:
                    f.write(n + '\n')
        if local_rejected:
            with open(REJECTED_FILE, 'a', encoding='utf-8') as f:
                for n, lt, c in local_rejected:
                    f.write(f"{n}\t{lt}\t{c}\n")

def print_progress(stats, total):
    done = stats['mobile'] + stats['rejected']
    pct = done / total * 100 if total else 0
    print(f"\r  [{done:,}/{total:,}] {pct:.1f}% | Mobile: {stats['mobile']:,} | Rejetes: {stats['rejected']:,}   ", end='', flush=True)

def main():
    numbers = load_numbers()
    keys = load_keys()
    
    if not keys:
        print("""
AUCUNE CLE API TROUVEE!

OPTIONS:
  1. Creer un compte GRATUIT (sans CB) sur https://veriphone.io
     -> Copier votre cle API depuis le dashboard
     -> Sauvegarder dans: veriphone_keys.txt (une cle par ligne)
     
  2. Lancer: python verify_multikey.py --keys CLE1,CLE2,CLE3
  
  3. Pour 30 cles gratuites (30x1000 = 30,000 verifs):
     -> Creer 30 comptes avec des emails Guerrilla Mail (guerrillamail.com)
     -> Chaque compte = 1000 verifications gratuites/mois
     
SCRIPT AUTOMATIQUE DE CREATION DE COMPTES (en cours de dev):
  python create_accounts.py --count 30
        """)
        return
    
    progress = load_progress()
    progress['done'] = set(progress.get('done', []))
    
    remaining = [n for n in numbers if n not in progress['done']]
    total = len(numbers)
    
    print(f"Total numeros  : {total:,}")
    print(f"Deja verifies  : {total - len(remaining):,}")
    print(f"A verifier     : {len(remaining):,}")
    print(f"Cles API dispo : {len(keys)}")
    print(f"Capacite totale: {len(keys) * 1000:,} verifications\n")
    
    if len(remaining) > len(keys) * 1000:
        print(f"[ATTENTION] Vous avez besoin d'au moins {len(remaining)//1000 + 1} cles API")
        print(f"  Actuellement: {len(keys)} cles = {len(keys)*1000:,} verifications max\n")
    
    # Diviser les numeros entre les cles
    chunk_size = max(1, len(remaining) // len(keys))
    chunks = [remaining[i:i+chunk_size] for i in range(0, len(remaining), chunk_size)]
    
    # Associer chunks aux cles
    key_chunks = [(chunk, keys[i % len(keys)]) for i, chunk in enumerate(chunks)]
    
    result_lock = threading.Lock()
    stats = {'total': 0, 'mobile': 0, 'rejected': 0}
    
    # Ecrire headers
    if not Path(OUTPUT_FILE).exists():
        with open(OUTPUT_FILE, 'w') as f:
            f.write("# Numeros mobiles Alberta - Verifies via Veriphone API\n")
    
    print(f"Demarrage verification avec {min(MAX_WORKERS, len(keys))} threads paralleles...")
    print(f"Fichier resultat: {OUTPUT_FILE}\n")
    
    start = time.time()
    
    with ThreadPoolExecutor(max_workers=min(MAX_WORKERS, len(keys))) as executor:
        futures = [
            executor.submit(worker, chunk, key, result_lock, progress, stats)
            for chunk, key in key_chunks
        ]
        
        # Afficher progression
        while any(not f.done() for f in futures):
            print_progress(stats, len(remaining))
            save_progress(progress)
            time.sleep(5)
        
        print_progress(stats, len(remaining))
    
    elapsed = time.time() - start
    save_progress(progress)
    
    print(f"\n\n{'='*55}")
    print(f"VERIFICATION TERMINEE en {elapsed:.0f}s")
    print(f"  Mobiles confirmes : {stats['mobile']:,}")
    print(f"  Rejetes (fixe/VoIP): {stats['rejected']:,}")
    print(f"  Taux mobile        : {stats['mobile']/(stats['total'] or 1)*100:.1f}%")
    print(f"  Fichier final      : {OUTPUT_FILE}")

if __name__ == '__main__':
    main()
