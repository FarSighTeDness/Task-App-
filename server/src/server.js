// server.js
import express from 'express';
import usersRouter from '../routes/users.js';
import { logger } from '../middleware/logger.js';

const app = express();
const PORT = 3000;

app.use(express.json());   // parse JSON
app.use(logger);           // custom middleware
app.use('/tasks', usersRouter); // routes

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
