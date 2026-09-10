"""
======================================================
VERIFIEUR HLR INTELLIGENT - METHODE TELEGRAM (GRATUIT)
======================================================
Telegram exige une vraie SIM mobile pour s'inscrire.
Si un numero est trouve sur Telegram = mobile actif confirme.

PREREQUIS:
  pip install telethon
  
  1. Aller sur https://my.telegram.org/apps
  2. Creer une app -> obtenir api_id et api_hash (GRATUIT)
  3. Remplir API_ID et API_HASH ci-dessous
  
LIMITES:
  - ~200 lookups/minute (respecte automatiquement)
  - Necessite 1 compte Telegram (votre numero perso)
"""

import asyncio
import json
import time
import random
from pathlib import Path

try:
    from telethon import TelegramClient
    from telethon.errors import (
        PhoneNumberInvalidError, FloodWaitError,
        UsernameNotOccupiedError, PeerFloodError
    )
    from telethon.tl.functions.contacts import ImportContactsRequest, DeleteContactsRequest
    from telethon.tl.types import InputPhoneContact
except ImportError:
    print("Installer: pip install telethon")
    exit(1)

# ============================================================
# CONFIGURATION - A REMPLIR
# ============================================================
API_ID   = 0           # <-- votre api_id de https://my.telegram.org
API_HASH = ""          # <-- votre api_hash
PHONE    = ""          # <-- votre numero Telegram ex: +15141234567
# ============================================================

INPUT_FILE   = r"C:\Users\km\Downloads\dhblink\alberta_mobile_30000.txt"
OUTPUT_MOBILE = r"C:\Users\km\Downloads\dhblink\verified_mobile_telegram.txt"
OUTPUT_PROGRESS = r"C:\Users\km\Downloads\dhblink\telegram_progress.json"

BATCH_SIZE  = 50    # Contacts par lot (limite Telegram)
DELAY_MIN   = 2.0   # Secondes min entre lots
DELAY_MAX   = 5.0   # Secondes max entre lots

def load_numbers():
    nums = []
    with open(INPUT_FILE, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                # Convertir +1-403-200-1234 -> +14032001234
                clean = line.replace("-", "").replace(" ", "")
                if not clean.startswith("+"):
                    clean = "+" + clean
                nums.append((line, clean))
    return nums

def load_progress():
    if Path(OUTPUT_PROGRESS).exists():
        with open(OUTPUT_PROGRESS) as f:
            return json.load(f)
    return {"checked": [], "confirmed_mobile": [], "last_index": 0}

def save_progress(progress):
    with open(OUTPUT_PROGRESS, "w") as f:
        json.dump(progress, f, indent=2)

async def check_batch(client, batch):
    """
    Verifie un lot de numeros via importation temporaire de contacts.
    Retourne la liste des numeros trouves sur Telegram (= mobiles actifs).
    """
    contacts = [
        InputPhoneContact(
            client_id=i,
            phone=e164,
            first_name=f"Check{i}",
            last_name=""
        )
        for i, (_, e164) in enumerate(batch)
    ]
    
    result = await client(ImportContactsRequest(contacts))
    
    found_ids = {u.id for u in result.users}
    found_phones = set()
    
    for user in result.users:
        if hasattr(user, "phone") and user.phone:
            found_phones.add("+" + user.phone.lstrip("+"))
    
    # Nettoyer: supprimer les contacts importes
    if result.users:
        await client(DeleteContactsRequest(id=[u.id for u in result.users]))
    
    confirmed = []
    for orig, e164 in batch:
        # Normaliser pour comparaison
        e164_norm = e164.replace("+", "").lstrip("1")
        for fp in found_phones:
            fp_norm = fp.replace("+", "").lstrip("1")
            if e164_norm == fp_norm or e164_norm.endswith(fp_norm) or fp_norm.endswith(e164_norm):
                confirmed.append(orig)
                break
    
    return confirmed

async def main():
    if not API_ID or not API_HASH or not PHONE:
        print("[ERREUR] Remplissez API_ID, API_HASH et PHONE dans le script!")
        print("  Obtenez les cles gratuitement: https://my.telegram.org/apps")
        return
    
    numbers = load_numbers()
    progress = load_progress()
    start_idx = progress["last_index"]
    
    print(f"Total numeros: {len(numbers):,}")
    print(f"Deja verifies: {start_idx:,}")
    print(f"Restants: {len(numbers) - start_idx:,}")
    print(f"Confirmes mobiles jusqu'ici: {len(progress['confirmed_mobile']):,}")
    print()
    
    async with TelegramClient("alberta_checker", API_ID, API_HASH) as client:
        await client.start(phone=PHONE)
        print("[OK] Connecte a Telegram")
        
        remaining = numbers[start_idx:]
        
        for i in range(0, len(remaining), BATCH_SIZE):
            batch = remaining[i:i + BATCH_SIZE]
            batch_num = (start_idx + i) // BATCH_SIZE + 1
            total_batches = (len(numbers) + BATCH_SIZE - 1) // BATCH_SIZE
            
            try:
                confirmed = await check_batch(client, batch)
                
                progress["checked"].extend([orig for orig, _ in batch])
                progress["confirmed_mobile"].extend(confirmed)
                progress["last_index"] = start_idx + i + len(batch)
                
                # Sauvegarder en continu
                save_progress(progress)
                
                # Ecrire les confirmes dans le fichier de sortie
                if confirmed:
                    with open(OUTPUT_MOBILE, "a", encoding="utf-8") as f:
                        for n in confirmed:
                            f.write(n + "\n")
                
                pct = (progress["last_index"] / len(numbers)) * 100
                print(f"Lot {batch_num}/{total_batches} | "
                      f"{progress['last_index']:,}/{len(numbers):,} ({pct:.1f}%) | "
                      f"Mobiles confirmes: {len(progress['confirmed_mobile']):,} | "
                      f"Ce lot: {len(confirmed)}/{len(batch)}")
                
                # Delai anti-flood
                delay = random.uniform(DELAY_MIN, DELAY_MAX)
                await asyncio.sleep(delay)
                
            except FloodWaitError as e:
                print(f"[FLOOD] Telegram demande d'attendre {e.seconds}s...")
                await asyncio.sleep(e.seconds + 5)
            except PeerFloodError:
                print("[FLOOD] Limite atteinte, pause 60s...")
                await asyncio.sleep(60)
            except Exception as ex:
                print(f"[ERREUR] {ex} - on continue...")
                await asyncio.sleep(10)
        
        print(f"\n[TERMINE]")
        print(f"  Verifies: {progress['last_index']:,}")
        print(f"  Confirmes MOBILES (Telegram): {len(progress['confirmed_mobile']):,}")
        print(f"  Taux de presence: {len(progress['confirmed_mobile'])/len(numbers)*100:.1f}%")
        print(f"  Fichier: {OUTPUT_MOBILE}")

if __name__ == "__main__":
    asyncio.run(main())
