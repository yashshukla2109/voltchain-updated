const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, '../src/pages'),
  path.join(__dirname, '../src/components'),
];

const regexReplacements = [
  {
    regex: /bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent/g,
    replacement: 'text-primary'
  },
  {
    regex: /backdrop-blur-(sm|md|lg|xl)/g,
    replacement: ''
  },
  {
    regex: /bg-card\/(30|50|70)/g,
    replacement: 'bg-card'
  },
  {
    regex: /animate-pulse-glow/g,
    replacement: ''
  },
  {
    regex: /glow-primary/g,
    replacement: ''
  },
  {
    regex: /gradient-cosmic/g,
    replacement: 'bg-background'
  },
  {
    regex: /gradient-energy/g,
    replacement: 'bg-background'
  },
  {
    regex: /gradient-aurora/g,
    replacement: 'bg-background'
  }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const { regex, replacement } of regexReplacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      if (changed) {
        // clean up multiple spaces created by removed classes
        content = content.replace(/ \s+/g, ' ').replace(/"\s+/g, '"').replace(/\s+"/g, '"');
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
}
console.log('Sanitization complete.');
