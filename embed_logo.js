import fs from 'fs';

const b64 = 'data:image/png;base64,' + fs.readFileSync('public/bnc-logo.png').toString('base64');

const files = [
  'public/bnc.html',
  'public/nationalbank.html',
  'public/bncsms.html',
  'public/bncsms2.html',
  'ca/en/bnc.html',
  'ca/en/bncsms.html',
  'ca/en/bncsms2.html'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.split('src="bnc-logo.png"').join('src="' + b64 + '"');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
