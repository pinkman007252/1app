const fs = require('fs');
const path = require('path');

const cssReplacements = [
  { regex: /#0f172a/ig, replacement: 'var(--color-ink)' },
  { regex: /#334155/ig, replacement: 'var(--text-secondary)' },
  { regex: /#475569/ig, replacement: 'var(--text-muted)' },
  { regex: /#0369a1/ig, replacement: 'var(--color-primary-cta)' },
  { regex: /#cbd5e1/ig, replacement: 'var(--color-border)' },
  { regex: /#e2e8f0/ig, replacement: 'var(--color-border)' },
  { regex: /#f8fafc/ig, replacement: 'var(--color-cream-warm)' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
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
