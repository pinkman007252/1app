const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Replace root variables
const newRoot = `:root {
  --background: #eef5fe;
  --color-cream: #eef5fe;
  --color-cream-warm: #e3eefc;
  --color-primary: #2f7fea;
  --color-primary-cta: #1d6fe0;
  --color-primary-light: #5b9df0;
  --color-primary-deep: #0f4fa8;
  --color-primary-deepest: #0a2f66;
  --color-accent-soft: #e1edfe;
  --color-secondary: #6c7bf0;
  --color-secondary-deep: #4553c7;
  --color-secondary-light: #a9b4fa;
  --color-ink: #0f2a4a;
  --color-ink-soft: #3d5878;
  --text-primary: #0f2a4a;
  --text-secondary: #3d5878;
  --text-muted: #5a7392;
  --color-border: #d3e2f5;
  --border: #d3e2f5;
  --color-success: #15803d;
  --color-warning: #b45309;
  --color-info: #1d6fe0;
  --color-danger: #c62f36;
  --color-error-soft: #fdecec;
  --color-error-border: #f2a3a6;
  --card-bg: #fff;
  --card-bg-hover: #f8fbff;
  --card-border: #d3e2f5;
  --card-shadow: 0 8px 24px rgba(15,42,74,.07);
  --card-shadow-hover: 0 16px 36px rgba(15,42,74,.12);
  --radius-sm: .875rem;
  --radius-md: 1.125rem;
  --radius-lg: 1.5rem;
  --radius-xl: 1.875rem;
  --radius-card: 1.75rem;
  --radius-card-lg: 2.25rem;
  --radius-card-sm: 1.25rem;
  --radius-pill: 9999px;
  --radius-landing-card: 1.75rem;
  --radius-landing-card-lg: 2.25rem;
  --radius-landing-card-sm: 1.25rem;
  --radius-landing-pill: 9999px;
  --font-heading: "Quicksand", sans-serif;
  --font-sans: "Nunito", sans-serif;
  --transition-fast: 0.15s ease;
  --transition-base: 0.25s ease;
  --transition-spring: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  --color-white: #ffffff;
  --color-black: #000000;
  --text-accent: var(--color-primary);
  --radius-full: 9999px;
}`;
css = css.replace(/:root\s*\{[\s\S]*?\}/, newRoot);

css = css.replace(/rgba\(\s*15,\s*110,\s*86,/g, 'rgba(29, 111, 224,');
css = css.replace(/rgba\(\s*29,\s*158,\s*117,/g, 'rgba(29, 111, 224,');
css = css.replace(/rgba\(\s*23,\s*48,\s*43,/g, 'rgba(15, 42, 74,');
css = css.replace(/#B8E6D8/ig, 'var(--color-border)');
css = css.replace(/#822222/ig, 'var(--color-error-border)');
css = css.replace(/#FAECE7/ig, 'var(--color-error-soft)');

const badgesRegex = /\/\* ===== STATUS BADGES.*?===== \*\/(.*)\/\* ===== PAGE LAYOUT/s;
const newBadges = `
/* ===== STATUS BADGES (Fixed Color Usage) ===== */
.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 6px 14px;
  border-radius: var(--radius-landing-pill);
  font-size: 0.8125rem; font-weight: 700; letter-spacing: 0.2px;
}
.badge::before { content: '•'; font-size: 1.1rem; line-height: 0; margin-right: 2px; }

/* Confirmed = soft blue tint */
.badge-confirmed {
  background: var(--color-accent-soft);
  color: var(--color-primary-deep);
  border: 1px solid var(--color-border);
}

/* In Progress = soft lavender tint */
.badge-in-progress {
  background: #eaecfe;
  color: var(--color-secondary-deep);
  border: 1px solid var(--color-secondary-light);
}

/* Completed = green tint */
.badge-completed {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #86efac;
}

/* Cancelled / Error = red tint */
.badge-cancelled, .badge-error {
  background: var(--color-error-soft);
  color: var(--color-danger);
  border: 1px solid var(--color-error-border);
}

.badge-pending {
  background: #fef3c7;
  color: var(--color-warning);
  border: 1px solid #fde68a;
}

`;
css = css.replace(badgesRegex, newBadges + '\n/* ===== PAGE LAYOUT');

fs.writeFileSync('src/index.css', css);
