$files = Get-ChildItem -Path . -Include *.html, *.js -Recurse
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false
    
    if ($content.Contains("Ã]")) {
        $content = $content.Replace("Ã]", "à")
        $modified = $true
    }
    
    # \uFFFD replacement character
    $ufffd = [char]0xFFFD
    if ($content.Contains($ufffd)) {
        # 'Code  6 chiffres' -> 'Code à 6 chiffres'
        $content = $content.Replace("Code " + $ufffd, "Code à")
        $content = $content.Replace($ufffd + "o.", "No.")
        $content = $content.Replace("rpondre " + $ufffd, "répondre à")
        $content = $content.Replace("bo" + $ufffd + "te", "boîte")
        $content = $content.Replace("m" + $ufffd + "me", "même")
        $content = $content.Replace($ufffd, "à") # default fallback
        $modified = $true
    }
    
    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Replaced in $($file.Name)"
    }
}
