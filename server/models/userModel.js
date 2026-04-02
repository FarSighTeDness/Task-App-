// models/userModel.js
import pool from '../config/db.js';

async function ensureSerialNoColumn() {
  await pool.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS serial_no INTEGER');
}

async function rebuildSerialNumbers() {
  await pool.query(`
    WITH ranked AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
      FROM tasks
    )
    UPDATE tasks t
    SET serial_no = ranked.rn
    FROM ranked
    WHERE t.id = ranked.id
  `);
}

async function prepareSerialNumbers() {
  await ensureSerialNoColumn();
  await rebuildSerialNumbers();
}

export async function getUsers() {
  await prepareSerialNumbers();

  const result = await pool.query(`
    SELECT
      id,
      serial_no,
      name,
      emailid,
      task
    FROM tasks
    ORDER BY serial_no, id
  `);
  return result.rows;
}

export async function addUser(name, emailid, task) {
  await prepareSerialNumbers();

  try {
    await pool.query('BEGIN');

    const inserted = await pool.query(
      'INSERT INTO tasks (name, emailid, task) VALUES ($1, $2, $3) RETURNING id',
      [name, emailid, task]
    );

    const insertedId = inserted.rows[0].id;

    await rebuildSerialNumbers();

    const result = await pool.query(
      'SELECT id, serial_no, name, emailid, task FROM tasks WHERE id = $1',
      [insertedId]
    );

    await pool.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

export async function updateUser(id, name, emailid, task) {
  await prepareSerialNumbers();

  const result = await pool.query(
    `UPDATE tasks
     SET name=$1, emailid=$2, task=$3
     WHERE id=$4
     RETURNING id, serial_no, name, emailid, task`,
    [name, emailid, task, id]
  );
  return result.rows[0];
}

export async function deleteUser(id) {
  await prepareSerialNumbers();

  try {
    await pool.query('BEGIN');

    const found = await pool.query('SELECT id FROM tasks WHERE id=$1', [id]);

    if (found.rowCount === 0) {
      await pool.query('ROLLBACK');
      return { message: 'User not found' };
    }

    await pool.query('DELETE FROM tasks WHERE id=$1', [id]);
    await rebuildSerialNumbers();

    await pool.query('COMMIT');
    return { message: 'User deleted and serial_no updated' };
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}
