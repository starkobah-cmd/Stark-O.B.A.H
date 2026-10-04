/**
 * Hostinger Production Entrypoint (ES Module Compatible)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

process.env.NODE_ENV = 'production';

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
