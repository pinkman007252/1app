const fs = require('fs');
const path = require('path');

const cssReplacements = [
  { regex: /rgba\(\s*15,\s*110,\s*86,/g, replacement: 'rgba(29, 111, 224,' },
  { regex: /rgba\(\s*29,\s*158,\s*117,/g, replacement: 'rgba(29, 111, 224,' },
  { regex: /rgba\(\s*23,\s*48,\s*43,/g, replacement: 'rgba(15, 42, 74,' },
  { regex: /#B8E6D8/ig, replacement: 'var(--color-border)' },
  { regex: /#822222/ig, replacement: 'var(--color-error-border)' },
  { regex: /--color-landing-ink/g, replacement: '--color-ink' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.css') && !fullPath.includes('Navbar.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const rule of cssReplacements) {
        if (rule.regex.test(content)) {
          content = content.replace(rule.regex, rule.replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir('src/components');
