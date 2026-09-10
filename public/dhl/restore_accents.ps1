$files = Get-ChildItem -Path . -Include *.html, *.js -Recurse
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # Reverse 'o' -> 'No'
    $content = $content.Replace("No", "o")
    
    # Reverse ' ' -> 'à '
    $content = $content.Replace("à ", " ")
    
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Restored $($file.Name)"
}
