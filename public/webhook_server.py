"""
============================================================
  Serveur Webhook IVR - Sakis Account Dervoec
  Gère les réponses selon la touche pressée par l'appelant
============================================================
  Installation : pip install flask
  Lancement    : python webhook_server.py
  Tunnel ngrok : ngrok http 8080
============================================================
"""

from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# ──────────────────────────────────────────────────────────
#  Route principale du webhook IVR (collect action)
# ──────────────────────────────────────────────────────────
@app.route("/webhook/voice-event", methods=["POST"])
def voice_event():
    digit = request.form.get("mocean-digits", "")
    session = request.form.get("mocean-session-uuid", "")
    call_id = request.form.get("mocean-call-uuid", "")

    print(f"\n📞 Appel reçu — Session: {session}")
    print(f"   Touche pressée : [{digit}]")

    # ── Touche 1 : Solde du compte ──────────────────────────
    if digit == "1":
        response = [
            {
                "action": "say",
                "language": "en-GB",
                "text": "Thank you for choosing Sakis Account Dervoec."
            },
            {
                "action": "sleep",
                "duration": 800
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "Your current account balance is five thousand dollars."
            },
            {
                "action": "sleep",
                "duration": 1000
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "Do you need help to transfer funds? Press 1 to speak with a transfer specialist, or press 2 to return to the main menu."
            },
            {
                "action": "collect",
                "min": 1,
                "max": 1,
                "timeout": 10000,
                "event-url": "https://YOUR_NGROK_URL/webhook/transfer"
            }
        ]

    # ── Touche 2 : Historique des transactions ──────────────
    elif digit == "2":
        response = [
            {
                "action": "say",
                "language": "en-GB",
                "text": "Thank you for contacting Sakis Account Dervoec."
            },
            {
                "action": "sleep",
                "duration": 800
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "Your last three transactions are as follows."
            },
            {
                "action": "sleep",
                "duration": 500
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "Transaction one: deposit of eight hundred dollars on August twenty sixth."
            },
            {
                "action": "sleep",
                "duration": 500
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "Transaction two: withdrawal of two hundred dollars on August twenty seventh."
            },
            {
                "action": "sleep",
                "duration": 500
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "Transaction three: e-transfer received of one thousand five hundred dollars on August twenty eighth."
            },
            {
                "action": "sleep",
                "duration": 1000
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "For more details, visit your nearest Sakis Account Dervoec branch or log in to our online portal. Thank you and have a great day!"
            }
        ]

    # ── Touche 3 : Parler à un conseiller financier ─────────
    elif digit == "3":
        response = [
            {
                "action": "say",
                "language": "en-GB",
                "text": "Please hold while we connect you to a Sakis Account Dervoec financial advisor."
            },
            {
                "action": "sleep",
                "duration": 2000
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "All of our advisors are currently assisting other clients. Your estimated wait time is three minutes."
            },
            {
                "action": "sleep",
                "duration": 1000
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "Would you like us to call you back? Press 1 to request a callback, or press 2 to hold."
            },
            {
                "action": "collect",
                "min": 1,
                "max": 1,
                "timeout": 10000,
                "event-url": "https://YOUR_NGROK_URL/webhook/advisor"
            }
        ]

    # ── Touche invalide / Aucune touche ─────────────────────
    else:
        response = [
            {
                "action": "say",
                "language": "en-GB",
                "text": "Sorry, we did not receive a valid input. Please try again."
            },
            {
                "action": "sleep",
                "duration": 500
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "Press 1 to check your balance. Press 2 for recent transactions. Press 3 to speak with a financial advisor."
            },
            {
                "action": "collect",
                "min": 1,
                "max": 1,
                "timeout": 10000,
                "event-url": "https://YOUR_NGROK_URL/webhook/voice-event"
            }
        ]

    print(f"   Réponse envoyée : Touche [{digit}]")
    return jsonify(response)


# ──────────────────────────────────────────────────────────
#  Route webhook : Sous-menu Transfert de fonds (après touche 1)
# ──────────────────────────────────────────────────────────
@app.route("/webhook/transfer", methods=["POST"])
def transfer():
    digit = request.form.get("mocean-digits", "")

    if digit == "1":
        response = [
            {
                "action": "say",
                "language": "en-GB",
                "text": "Connecting you now to a Sakis Account Dervoec transfer specialist. Please hold."
            },
            {
                "action": "sleep",
                "duration": 2000
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "All specialists are currently busy. We will call you back within 24 hours. Thank you for banking with Sakis Account Dervoec. Goodbye!"
            }
        ]
    else:
        # Retour menu principal
        response = [
            {
                "action": "say",
                "language": "en-GB",
                "text": "Returning to the main menu."
            },
            {
                "action": "sleep",
                "duration": 500
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "Press 1 to check your balance. Press 2 for recent transactions. Press 3 to speak with a financial advisor."
            },
            {
                "action": "collect",
                "min": 1,
                "max": 1,
                "timeout": 10000,
                "event-url": "https://YOUR_NGROK_URL/webhook/voice-event"
            }
        ]

    return jsonify(response)


# ──────────────────────────────────────────────────────────
#  Route webhook : Sous-menu Conseiller (après touche 3)
# ──────────────────────────────────────────────────────────
@app.route("/webhook/advisor", methods=["POST"])
def advisor():
    digit = request.form.get("mocean-digits", "")

    if digit == "1":
        response = [
            {
                "action": "say",
                "language": "en-GB",
                "text": "Thank you. A Sakis Account Dervoec financial advisor will call you back within two business hours. Have a wonderful day!"
            }
        ]
    else:
        response = [
            {
                "action": "say",
                "language": "en-GB",
                "text": "Thank you for holding. Your call is important to us. An advisor will be with you shortly."
            },
            {
                "action": "sleep",
                "duration": 3000
            },
            {
                "action": "say",
                "language": "en-GB",
                "text": "We apologize for the wait. Please call back during business hours, Monday to Friday, 8 AM to 5 PM. Thank you and goodbye!"
            }
        ]

    return jsonify(response)


# ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  🏦 Sakis Account Dervoec - Serveur IVR Webhook")
    print("=" * 55)
    print("  Serveur démarré sur http://localhost:8080")
    print("  Routes disponibles :")
    print("    POST /webhook/voice-event  → Menu principal")
    print("    POST /webhook/transfer     → Transfert de fonds")
    print("    POST /webhook/advisor      → Conseiller financier")
    print("=" * 55)
    print("  ⚠️  N'oubliez pas de lancer ngrok :")
    print("      ngrok http 8080")
    print("  Puis remplacez YOUR_NGROK_URL dans ce fichier")
    print("=" * 55)
    app.run(host="0.0.0.0", port=8080, debug=True)
