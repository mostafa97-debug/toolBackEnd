import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
const app = express();

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import testCaseRoutes from './routes/testcases.routes.js';
import modulesRoutes from './routes/modules.routes.js';
import SubmitRequestRoutes from './routes/SubmitRequest.routes.js';

app.use(json());
app.use('/auth', authRoutes);
app.use('/', projectRoutes);
app.use('/api', testCaseRoutes);
app.use('/api', modulesRoutes);
app.use('/api', SubmitRequestRoutes);

app.listen(3005, () => console.log('Server running on http://localhost:3005'));
