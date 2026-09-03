import fs from 'fs';

let content = fs.readFileSync('public/main_interac.html', 'utf8');

const startStr = '<script>\r\n// Dropdown selection handling';
const startStrLf = '<script>\n// Dropdown selection handling';
const endStr = '</script>\r\n\r\n\r\n<script src="security_module.js"></script>';
const endStrLf = '</script>\n\n\n<script src="security_module.js"></script>';

let startIdx = content.indexOf('// Dropdown selection handling');
if (startIdx !== -1) {
  let scriptStart = content.lastIndexOf('<script>', startIdx);
  let scriptEnd = content.indexOf('</script>', startIdx) + '</script>'.length;
  content = content.substring(0, scriptStart) + content.substring(scriptEnd);
  fs.writeFileSync('public/main_interac.html', content, 'utf8');
  console.log('Successfully cut dropdown selection handling block!');
} else {
  console.log('Not found');
}
