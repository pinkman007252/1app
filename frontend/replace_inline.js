const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /#f1f5f9/ig, replacement: 'var(--color-ink)' },
  { regex: /#94a3b8/ig, replacement: 'var(--color-ink-soft)' },
  { regex: /#64748b/ig, replacement: 'var(--text-muted)' },
  { regex: /#67e8f9/ig, replacement: 'var(--color-primary-deep)' },
  { regex: /#a78bfa/ig, replacement: 'var(--color-primary-cta)' },
  { regex: /#6ee7b7/ig, replacement: 'var(--color-success)' },
  { regex: /#10b981/ig, replacement: 'var(--color-success)' },
  { regex: /#7c3aed/ig, replacement: 'var(--color-secondary)' },
  { regex: /#ef4444/ig, replacement: 'var(--color-danger)' },
  { regex: /rgba\(\s*6\s*,\s*182\s*,\s*212\s*,/g, replacement: 'rgba(47, 127, 234,' },
  { regex: /rgba\(\s*124\s*,\s*58\s*,\s*237\s*,/g, replacement: 'rgba(108, 123, 240,' },
  { regex: /'Outfit,sans-serif'/g, replacement: 'var(--font-heading)' },
  { regex: /"Outfit,sans-serif"/g, replacement: 'var(--font-heading)' },
  { regex: /'Outfit',\s*sans-serif/g, replacement: 'var(--font-heading)' },
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
      for (const rule of replacements) {
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
