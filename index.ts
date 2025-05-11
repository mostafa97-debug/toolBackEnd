import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3005;
app.use(cors());


// Dummy project list
const projects = [
  { id: 1, name: 'Project Alpha' },
  { id: 2, name: 'Project Beta' },
  { id: 3, name: 'Project Gamma' },
];

// Route to get list of projects
app.get('/api/projects', (req: Request, res: Response) => {
  res.json(projects);
});

// Start the server
app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});
