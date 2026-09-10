#!/bin/bash
curl -X POST "https://rest.moceanapi.com/rest/2/sms" \
-H "Authorization: Bearer apit-m5u3YH3L0cWyaOKx7jTnXadBwUwQrxhC-rAvf7" \
-d "mocean-from=MOCEAN&mocean-to=14503007411&mocean-text=hi there baby"
