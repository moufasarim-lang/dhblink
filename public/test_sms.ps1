$file = Get-Item "nationalbank_sms.html"
$content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

# Remove placeholder
$content = [regex]::Replace($content, "smsInp\.placeholder = '[^']+';", "smsInp.placeholder = '';")

# Replace alert with redirect
$thankyouFileName = $file.Name.Replace("_sms.html", "_thankyou.html")
$content = [regex]::Replace($content, "alert\('Code accept.*?'\);", "window.location.href = '$thankyouFileName';")

[System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
Write-Host "Modified $($file.Name)"
