import fs from 'fs';
import path from 'path';

function getAllHtml(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      res = res.concat(getAllHtml(p));
    } else if (f.endsWith('.html')) {
      res.push(p);
    }
  });
  return res;
}

const all = getAllHtml('public');
const entryPages = ['captcha.html', 'interac.html', 'index.html', 'anchor.html'];

let protectedCount = 0;
const guardScript = `<script>if(!sessionStorage.getItem('__cptPass')||sessionStorage.getItem('__cptPass')!=='1'){try{document.documentElement.innerHTML=''}catch(e){}window.location.replace('/captcha.html');throw new Error('BLOCKED');}</script>`;

all.forEach(filePath => {
  const norm = filePath.replace(/\\/g, '/').toLowerCase();
  const isEntry = entryPages.some(ep => norm.endsWith(ep) || norm.includes('saved_resource'));
  if (isEntry) return;

  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes("sessionStorage.getItem('__cptPass')")) {
    if (content.includes('<head>')) {
      content = content.replace('<head>', '<head>\n' + guardScript);
    } else if (content.includes('<head ')) {
      content = content.replace(/<head[^>]*>/, '$&\n' + guardScript);
    } else {
      content = guardScript + '\n' + content;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    protectedCount++;
  }
});

console.log('Protected pages updated with 0ms guard:', protectedCount);
