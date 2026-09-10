import json, re
content = open("sendit.py", "r", encoding="utf-8").read()
auth  = re.search(r'AUTH_TOKEN = "(.+?)"', content).group(1)
xsrf  = re.search(r'XSRF_TOKEN = "(.+?)"', content).group(1)
cookie= re.search(r'COOKIE = "(.+?)"', content).group(1)
fid   = re.search(r'FIELD_ID = "(.+?)"', content).group(1)
cid   = re.search(r'CONVERSATION_ID = "(.+?)"', content).group(1)
chuid = re.search(r'CHANNEL_UID = "(.+?)"', content).group(1)

