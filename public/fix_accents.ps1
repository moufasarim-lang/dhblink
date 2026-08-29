$replacements = @{
    'Ã©' = 'é'
    'Ã¨' = 'è'
    'Ãª' = 'ê'
    'Ã§' = 'ç'
    'Ã ' = 'à'
    'Ã¢' = 'â'
    'Ã®' = 'î'
    'Ã´' = 'ô'
    'Ã»' = 'û'
    'Ã]' = 'à'
    'Ǹ' = 'é'
    'Ǧ' = 'ê'
    'o' = 'No'
    ' ' = 'à '
    '' = 'à'
    'l?T' = "l'"
    'd?T' = "d'"
    'n?T' = "n'"
    's?T' = "s'"
    'qu?T' = "qu'"
    'c?T' = "c'"
    'jusqu?T' = "jusqu'"
}

$files = Get-ChildItem -Path . -Include *.html, *.js -Recurse

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false

    foreach ($key in $replacements.Keys) {
        if ($content.Contains($key)) {
            $content = $content.Replace($key, $replacements[$key])
            $modified = $true
        }
    }

    # Replace real links
    $newContent = [regex]::Replace($content, 'href="https?://[^"]+"', 'href="#"')
    if ($newContent -cne $content) {
        $content = $newContent
        $modified = $true
    }
    
    $newContent = [regex]::Replace($content, "href='https?://[^']+'", "href='#'")
    if ($newContent -cne $content) {
        $content = $newContent
        $modified = $true
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Modified $($file.Name)"
    }
}
