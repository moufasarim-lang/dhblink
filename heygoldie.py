import requests
import uuid
import sys
import time
import json

# ====================================================================
# CONFIGURATION (À MODIFIER)
# ====================================================================
BASE_URL = "https://api.heygoldie.com/live/rest"

# ⚠️ REMPLACEZ CE TOKEN PAR UN NOUVEAU TOKEN VALIDE (voir explications ci-dessous)
AUTH_TOKEN = "Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhcHBvaW50Zml4TW9iaWxlQXBwIiwidXNlcl9uYW1lIjoiYzg0ODQ3YTItYTUxMy00YTFiLTkwZGYtMDI4Y2E2NDY0ZWI3Iiwic2NvcGUiOiJmNzllNzEwYS1mZjBlLTRmOGEtYWQ0Yi03Zjg0MzM3ZGY3ZWMiLCJpc3MiOiJHb2xkaWUiLCJleHAiOjE3ODgzODIxNDAsImlhdCI6MTc4ODM3ODU0MCwiYnVzaW5lc3NfaWQiOiI2YzA2M2Q1MC0yMjYwLTRkZTUtOGQ0Yi1hNTNhMTY3OGNhNmIiLCJhdXRob3JpdGllcyI6WyJDTElFTlQiLCJNT0JJTEVBUFAiXX0.mNoABKyXyh5MCGk8iPMor-uHMeG48WgQ-w9Gj09ezRdd0Kcxuw-vmDcGeGXlmouXFcBQg6H67xmZbwLVpiYCY_lFH8YyhPwYFJnwmPSsigQIdXAP7p7lMj86ZSVaD_JK6ZZo_g3f7k2qZz6hCH1oumuaw00gayb_ZlZsMLU6tCiNxYDILYOuQddUYwJGu4mDP_1I2U0PGWiZt3FWlOySwFL1QtUbIsGHMFGPjr_XVzC35uXsy90DGvZcOKZ3A7TPYgkrSDKyce34a2u9ZORfPiwmaQnliyaBsts55lZ0W6crH2-RU5V7oOz2l5n-lvTh870p36CRJwx8qYD85OL0RA"

MESSAGE_TEXT = (
    "ROGERS NB sent you a refund at https://yourdepse-ca.blinkpowered.com"
)

INPUT_FILE = "listanums.txt"   # un numéro par ligne, format international (+1...)

# ====================================================================
# FONCTIONS
# ====================================================================
def get_headers():
    """Retourne les en-têtes HTTP communs à toutes les requêtes."""
    return {
        "Authorization": AUTH_TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json",          # ESSENTIEL : exige du JSON, pas du HTML
        "Origin": "https://app.heygoldie.com",
        "Referer": "https://app.heygoldie.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

def create_client(phone):
    """Crée un client pour le numéro donné et retourne son ID (ou None)."""
    client_id = str(uuid.uuid4())
    payload = {
        "id": client_id,
        "name": phone,
        "phone": phone,
        "secondaryPhone": "",
        "email": "",
        "notes": "",
        "isBlocked": False,
        "isNotesDisplayed": True,
        "location": "",
        "subClients": [],
        "birthDate": None,
        "availableReward": None,
        "photoTimestamp": None,
        "photoUrl": None,
        "hasLongTermCardOnFile": False,
        "lastAppointment": None
    }
    try:
        resp = requests.post(f"{BASE_URL}/clients", headers=get_headers(), json=payload, timeout=10)
        # Vérifier le type de contenu
        content_type = resp.headers.get("Content-Type", "")
        if "application/json" not in content_type:
            print(f"⚠️ Réponse non-JSON pour {phone} (Content-Type: {content_type})")
            print(f"   Début de la réponse : {resp.text[:200]}")
            return None
        if resp.status_code != 200:
            print(f"❌ HTTP {resp.status_code} pour {phone}")
            try:
                err = resp.json()
                print(f"   Message : {err}")
            except:
                print(f"   Réponse : {resp.text[:200]}")
            return None
        data = resp.json()
        client_id = data.get("id")
        if not client_id:
            print(f"⚠️ Pas d'ID dans la réponse pour {phone} : {data}")
            return None
        print(f"✅ Client créé pour {phone} (ID: {client_id})")
        return client_id
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur réseau pour {phone} : {e}")
        return None
    except json.JSONDecodeError:
        print(f"❌ JSON invalide pour {phone} : {resp.text[:200]}")
        return None

def send_sms(client_id, phone):
    """Envoie le SMS au client. Retourne True si réussi."""
    message_id = str(uuid.uuid4())
    payload = {"id": message_id, "message": MESSAGE_TEXT}
    try:
        resp = requests.post(
            f"{BASE_URL}/clients/{client_id}/messages",
            headers=get_headers(),
            json=payload,
            timeout=10
        )
        if resp.status_code == 200:
            print(f"✅ SMS envoyé à {phone}")
            return True
        else:
            print(f"❌ Échec envoi SMS pour {phone} – HTTP {resp.status_code}")
            print(f"   Réponse : {resp.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ Erreur envoi SMS pour {phone} : {e}")
        return False

# ====================================================================
# PROGRAMME PRINCIPAL
# ====================================================================
def main():
    try:
        with open(INPUT_FILE, "r", encoding="utf-8") as f:
            numbers = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"❌ Fichier '{INPUT_FILE}' introuvable.")
        sys.exit(1)

    if not numbers:
        print("⚠️ Aucun numéro trouvé.")
        return

    print(f"📋 {len(numbers)} numéro(s) à traiter.\n")
    for i, phone in enumerate(numbers, start=1):
        print(f"--- {i}/{len(numbers)} : {phone} ---")
        client_id = create_client(phone)
        if client_id:
            send_sms(client_id, phone)
        else:
            print("⏩ Création échouée, passage au suivant.")
        time.sleep(0.5)   # petite pause

    print("\n✅ Terminé.")

if __name__ == "__main__":
    main()
