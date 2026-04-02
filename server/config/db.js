// db.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from 'pg';

const { Client } = pkg;

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, 'utf8');
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function loadEnvFromRoot() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  loadEnvFile(path.resolve(__dirname, '../../.env'));
  loadEnvFile(path.resolve(__dirname, '../.env'));
}

loadEnvFromRoot();

const dbUser = process.env.DB_USER || process.env.POSTGRES_USER;
const dbHost = process.env.DB_HOST || 'localhost';
const dbName = process.env.DB_NAME || process.env.POSTGRES_DB;
const dbPassword = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD;
const dbPort = Number(process.env.DB_PORT || 5432);

if (!dbPassword || typeof dbPassword !== 'string') {
  throw new Error('Missing database password. Set DB_PASSWORD or POSTGRES_PASSWORD in .env.');
}

const client = new Client({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
});

await client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

export default client;
