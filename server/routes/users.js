// routes/users.js
import express from 'express';
import { getUsers, addUser, updateUser, deleteUser } from '../models/userModel.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  const tasks = await getUsers();
  res.json(tasks);
});



// POST new user
router.post('/', async (req, res) => {
  const { name, emailid, task } = req.body;
  const createdTask = await addUser(name, emailid, task);
  res.status(201).json(createdTask);
});

// PUT update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, emailid, task } = req.body;
  const updatedTask = await updateUser(id, name, emailid, task);
  res.json(updatedTask);
});

// DELETE user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await deleteUser(id);
  res.json(result);
});

export default router;
