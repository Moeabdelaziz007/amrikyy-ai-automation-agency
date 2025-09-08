#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing Bundle Size...\n');

// Check if we're in the frontend directory
const frontendPath = path.join(__dirname, 'frontend');
if (!fs.existsSync(frontendPath)) {
  console.error('❌ Frontend directory not found. Please run from project root.');
  process.exit(1);
}

process.chdir(frontendPath);

try {
  // Install bundle analyzer if not already installed
  console.log('📦 Installing bundle analyzer...');
  execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' });

  // Build the project
  console.log('\n🏗️ Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Analyze bundle
  console.log('\n📊 Analyzing bundle...');
  execSync('ANALYZE=true npm run build', { stdio: 'inherit' });

  console.log('\n✅ Bundle analysis complete!');
  console.log('📈 Check the generated reports in .next/analyze/');

} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
