@echo off
REM ============================================================
REM  IVR Sakis Account Dervoec - VERSION CORRIGEE (URL-encoded)
REM  Numero : 14503007411
REM ============================================================

echo ============================================================
echo   Sakis Account Dervoec - Lancement appel IVR
echo   Numero : 14503007411
echo ============================================================

curl.exe -X POST "https://rest.moceanapi.com/rest/2/voice/dial" ^
  -H "Authorization: Bearer apit-m5u3YH3L0cWyaOKx7jTnXadBwUwQrxhC-rAvf7" ^
  -d "mocean-to=14503007411" ^
  -d "mocean-resp-format=json" ^
  -d "mocean-command=%%5B%%7B%%22action%%22%%3A%%22say%%22%%2C%%22language%%22%%3A%%22en-GB%%22%%2C%%22text%%22%%3A%%22Welcome%%20to%%20Sakis%%20Account%%20Dervoec%%2C%%20your%%20trusted%%20financial%%20partner.%%22%%7D%%2C%%7B%%22action%%22%%3A%%22sleep%%22%%2C%%22duration%%22%%3A1000%%7D%%2C%%7B%%22action%%22%%3A%%22say%%22%%2C%%22language%%22%%3A%%22en-GB%%22%%2C%%22text%%22%%3A%%22Please%%20listen%%20carefully%%20to%%20the%%20following%%20options.%%20Press%%201%%20to%%20listen%%20to%%20your%%20account%%20balance.%%20Press%%202%%20for%%20your%%20recent%%20transactions.%%20Press%%203%%20to%%20speak%%20with%%20a%%20financial%%20advisor.%%22%%7D%%2C%%7B%%22action%%22%%3A%%22sleep%%22%%2C%%22duration%%22%%3A500%%7D%%2C%%7B%%22action%%22%%3A%%22collect%%22%%2C%%22min%%22%%3A1%%2C%%22max%%22%%3A1%%2C%%22timeout%%22%%3A10000%%2C%%22event-url%%22%%3A%%22https%%3A%%2F%%2Fexample.com%%2Fwebhook%%2Fvoice-event%%22%%7D%%5D"

echo.
echo Appel lance! Verifiez votre telephone.
pause
