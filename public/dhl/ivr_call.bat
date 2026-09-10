@echo off
REM ============================================================
REM  Script IVR - MoceanAPI Voice Dial
REM  Numero cible : 14503007411
REM  Token API    : apit-m5u3YH3L0cWyaOKx7jTnXadBwUwQrxhC-rAvf7
REM ============================================================

echo Lancement de l'appel IVR vers 14503007411...

curl.exe -X POST "https://rest.moceanapi.com/rest/2/voice/dial" ^
  -H "Authorization: Bearer apit-m5u3YH3L0cWyaOKx7jTnXadBwUwQrxhC-rAvf7" ^
  -d "mocean-to=14503007411" ^
  -d "mocean-resp-format=json" ^
  -d "mocean-command=%5B%7B%22action%22%3A%22say%22%2C%22language%22%3A%22en-GB%22%2C%22text%22%3A%22Welcome%20to%20our%20customer%20service.%22%7D%2C%7B%22action%22%3A%22sleep%22%2C%22duration%22%3A1000%7D%2C%7B%22action%22%3A%22say%22%2C%22language%22%3A%22en-GB%22%2C%22text%22%3A%22Press%201%20for%20billing%20enquiries.%20Press%202%20for%20technical%20support.%20Press%203%20to%20talk%20to%20a%20representative.%22%7D%2C%7B%22action%22%3A%22collect%22%2C%22min%22%3A1%2C%22max%22%3A1%2C%22timeout%22%3A10000%2C%22event-url%22%3A%22https%3A%2F%2Fexample.com%2Fwebhook%2Fvoice-event%22%7D%5D"

echo.
echo Appel termine. Verifiez la reponse ci-dessus.
pause
