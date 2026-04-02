// db.js
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'postgres',
  host: '62.72.31.10',
  database: 'test1',
  password: 'root@admin12345',
  port: 5432,
});

await client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

export default client;
