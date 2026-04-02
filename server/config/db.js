// db.js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;

function loadEnvFromRoot() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env'), override: false });
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
