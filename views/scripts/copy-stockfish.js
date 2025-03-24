import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy Stockfish files
const stockfishDir = path.join(__dirname, '../node_modules/stockfish.js');
const files = ['stockfish.wasm.js', 'stockfish.wasm'];

files.forEach(file => {
  const source = path.join(stockfishDir, file);
  const dest = path.join(publicDir, file === 'stockfish.wasm.js' ? 'stockfish.js' : file);
  
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log(`Copied ${file} to public directory as ${dest.split('/').pop()}`);
  } else {
    console.error(`Could not find ${file} in node_modules`);
  }
}); 