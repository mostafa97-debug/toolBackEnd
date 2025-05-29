import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
const app = express();

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import testCaseRoutes from './routes/testcases.routes.js';

app.use(json());
app.use('/auth', authRoutes);
app.use('/', projectRoutes);
app.use('/api', testCaseRoutes);

app.listen(3005, () => console.log('Server running on http://localhost:3005'));
