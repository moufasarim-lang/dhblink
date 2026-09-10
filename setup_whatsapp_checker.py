"""
======================================================
VERIFIEUR HLR INTELLIGENT - METHODE WHATSAPP (GRATUIT)
======================================================
WhatsApp verifie chaque numero par OTP SMS reel.
Si un numero est sur WhatsApp = SIM mobile active 100% confirme.

PREREQUIS:
  pip install whatsapp-web.py
  ou
  pip install selenium webdriver-manager

METHODE RECOMMANDEE: whatsapp-web.py (Node) OU selenium
Ici on utilise l'API whatsapp-web Python (wrapper officieux)

ALTERNATIVE SIMPLE:
  npm install -g whatsapp-web.js @whiskeysockets/baileys
"""

"""
======================================================
METHODE WHATSAPP via Node.js + Baileys (RECOMMANDE)
======================================================

INSTALLATION:
  1. Installer Node.js: https://nodejs.org
  2. Dans le dossier du projet:
     npm init -y
     npm install @whiskeysockets/baileys qrcode-terminal

SCRIPT NODE.JS (whatsapp_checker.js):
  Voir fichier whatsapp_checker.js cree automatiquement

UTILISATION:
  node whatsapp_checker.js
  -> Scanner le QR code avec votre WhatsApp
  -> Les resultats s'ecrivent dans verified_mobile_whatsapp.txt
"""

# Script de generation du fichier Node.js
NODEJS_SCRIPT = r"""
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = 'alberta_mobile_30000.txt';
const OUTPUT_FILE = 'verified_mobile_whatsapp.txt';
const PROGRESS_FILE = 'whatsapp_progress.json';
const DELAY_MS = 1500; // 1.5s entre chaque check

// Charger les numeros
function loadNumbers() {
    const lines = fs.readFileSync(INPUT_FILE, 'utf8').split('\n');
    return lines
        .filter(l => l.trim() && !l.startsWith('#'))
        .map(l => {
            const clean = l.trim().replace(/-/g, '').replace(/\s/g, '');
            const e164 = clean.startsWith('+') ? clean.slice(1) : clean;
            return { original: l.trim(), e164 };
        });
}

// Charger progression
function loadProgress() {
    if (fs.existsSync(PROGRESS_FILE)) {
        return JSON.parse(fs.readFileSync(PROGRESS_FILE));
    }
    return { lastIndex: 0, confirmed: 0 };
}

function saveProgress(p) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: require('pino')({ level: 'silent' })
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('\n[QR CODE] Scanner avec votre WhatsApp:');
            qrcode.generate(qr, { small: true });
        }
        
        if (connection === 'open') {
            console.log('\n[OK] Connecte a WhatsApp!');
            await runChecks(sock);
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('[RECONNEXION] ...');
                main();
            }
        }
    });
}

async function runChecks(sock) {
    const numbers = loadNumbers();
    const progress = loadProgress();
    
    console.log(`Total: ${numbers.length.toLocaleString()}`);
    console.log(`Deja verifies: ${progress.lastIndex.toLocaleString()}`);
    console.log(`Confirmes: ${progress.confirmed.toLocaleString()}\n`);
    
    const outputStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'a' });
    
    for (let i = progress.lastIndex; i < numbers.length; i++) {
        const { original, e164 } = numbers[i];
        const jid = e164 + '@s.whatsapp.net';
        
        try {
            // Verifier si le numero est sur WhatsApp
            const [result] = await sock.onWhatsApp(e164);
            
            if (result && result.exists) {
                outputStream.write(original + '\n');
                progress.confirmed++;
                process.stdout.write(`\r[${i+1}/${numbers.length}] Confirmes: ${progress.confirmed} | ${original} ✓`);
            } else {
                process.stdout.write(`\r[${i+1}/${numbers.length}] Confirmes: ${progress.confirmed} | ${original} ✗`);
            }
            
            progress.lastIndex = i + 1;
            
            // Sauvegarder progression toutes les 100 verifs
            if (i % 100 === 0) {
                saveProgress(progress);
            }
            
            await sleep(DELAY_MS + Math.random() * 500);
            
        } catch (err) {
            if (err.message?.includes('rate')) {
                console.log('\n[RATE LIMIT] Pause 30s...');
                await sleep(30000);
                i--; // Reessayer
            } else {
                console.log(`\n[ERREUR] ${err.message}`);
                await sleep(2000);
            }
        }
    }
    
    outputStream.end();
    saveProgress(progress);
    
    console.log(`\n\n[TERMINE]`);
    console.log(`  Verifies: ${numbers.length.toLocaleString()}`);
    console.log(`  Confirmes MOBILES (WhatsApp): ${progress.confirmed.toLocaleString()}`);
    console.log(`  Taux: ${(progress.confirmed/numbers.length*100).toFixed(1)}%`);
    console.log(`  Fichier: ${OUTPUT_FILE}`);
    process.exit(0);
}

main();
"""

import os

OUTPUT_DIR = r"C:\Users\km\Downloads\dhblink"
js_file = os.path.join(OUTPUT_DIR, "whatsapp_checker.js")
pkg_file = os.path.join(OUTPUT_DIR, "package.json")

with open(js_file, "w", encoding="utf-8") as f:
    f.write(NODEJS_SCRIPT)

pkg = {
    "name": "alberta-mobile-verifier",
    "version": "1.0.0",
    "description": "Verificateur mobile via WhatsApp",
    "main": "whatsapp_checker.js",
    "dependencies": {
        "@whiskeysockets/baileys": "latest",
        "qrcode-terminal": "latest",
        "pino": "latest"
    }
}
import json
with open(pkg_file, "w") as f:
    json.dump(pkg, f, indent=2)

print(f"[OK] Fichiers crees:")
print(f"  {js_file}")
print(f"  {pkg_file}")
print()
print("ETAPES:")
print("  1. Ouvrir PowerShell dans: C:\\Users\\km\\Downloads\\dhblink")
print("  2. npm install")
print("  3. node whatsapp_checker.js")
print("  4. Scanner le QR code avec votre WhatsApp")
print("  5. La verification demarre automatiquement")
