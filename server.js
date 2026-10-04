/**
 * Hostinger Production Entrypoint
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const bundledServer = path.join(__dirname, 'dist', 'server.cjs');

if (!fs.existsSync(bundledServer)) {
  console.log("dist/server.cjs not found. Automatically running build for Hostinger...");
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (err) {
    console.error("Auto-build failed:", err);
  }
}

if (fs.existsSync(bundledServer)) {
  require(bundledServer);
} else {
  console.error("Could not find dist/server.cjs. Please ensure dependencies are installed via 'npm install'.");
}
