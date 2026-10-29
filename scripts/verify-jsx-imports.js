import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = _traverse.default || _traverse;

const SRC_DIR = path.resolve('src');
let hasErrors = false;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.jsx')) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });
  } catch (err) {
    console.error(`[SYNTAX ERROR] ${filePath}: ${err.message}`);
    hasErrors = true;
    return;
  }

  traverse(ast, {
    JSXOpeningElement(path) {
      const nameNode = path.node.name;
      if (nameNode.type === 'JSXIdentifier') {
        const name = nameNode.name;
        // Custom component check (starts with uppercase)
        if (/^[A-Z]/.test(name)) {
          if (!path.scope.hasBinding(name)) {
            console.error(`[UNDEFINED COMPONENT] ${filePath}:${nameNode.loc?.start.line || 'unknown'} - <${name}> is used in JSX but not imported or declared!`);
            hasErrors = true;
          }
        }
      }
    }
  });
}

console.log('--- Scanning JSX Component References across src/ ---');
scanDir(SRC_DIR);

if (hasErrors) {
  console.error('\nFAIL: Undefined JSX components detected in source code!');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All JSX components across all files have valid imports and bindings.');
  process.exit(0);
}

