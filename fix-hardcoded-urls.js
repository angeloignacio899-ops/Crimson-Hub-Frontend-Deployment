const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'src');
const exts = ['.js', '.jsx'];
const files = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      walk(full);
    } else if (exts.includes(path.extname(item.name))) {
      files.push(full);
    }
  }
}
walk(root);
let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('http://localhost:5100')) continue;
  const original = content;
  content = content.replace(/`http:\/\/localhost:5100/g, '`' + '${window.API_BASE}');
  content = content.replace(/"http:\/\/localhost:5100/g, 'window.API_BASE + "');
  content = content.replace(/'http:\/\/localhost:5100/g, "window.API_BASE + '");
  content = content.replace(/http:\/\/localhost:5100/g, 'window.API_BASE');
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Updated', file);
  }
}
console.log('Files changed:', changed);
