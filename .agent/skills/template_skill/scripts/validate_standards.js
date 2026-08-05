import fs from 'fs';
import path from 'path';

console.log('Running Standard Validation Checks...');

let hasErrors = false;

// Check for accidentally committed .env files
const rootDir = process.cwd();
if (fs.existsSync(path.join(rootDir, '.env'))) {
    console.error('❌ ERROR: .env file found in root directory! Do not commit secrets.');
    hasErrors = true;
}

// Ensure frontend has Tailwind config
if (!fs.existsSync(path.join(rootDir, 'frontend', 'tailwind.config.js')) && 
    !fs.existsSync(path.join(rootDir, 'frontend', 'tailwind.config.ts'))) {
    console.warn('⚠️ WARNING: No Tailwind config found in frontend/.');
}

if (hasErrors) {
    process.exit(1);
} else {
    console.log('✅ All standard checks passed!');
}
