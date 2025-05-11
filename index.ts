import express, { Request, Response, Application, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import cors from 'cors';

const app: Application = express();
const port = 3005;
app.use(cors());

// Dummy project list
const projects = [
  { id: 1, name: 'Project Alpha' },
  { id: 2, name: 'Project Beta' },
  { id: 3, name: 'Project Gamma' },
];

// Route to get list of projects
const getProjects: RequestHandler = (req: Request, res: Response): void => {
  res.json(projects);
};
app.get('/api/projects', getProjects);

const testCases = [
    { id: 1, projectId: 1, name: 'Login Test', needsTestData: false },
    { id: 2, projectId: 1, name: 'Checkout Test', needsTestData: true },
    { id: 3, projectId: 2, name: 'Search Test', needsTestData: false },
    { id: 4, projectId: 3, name: 'Profile Update Test', needsTestData: true },
  ];

  // Route to get test cases for a specific project
  const getTestCases: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>> = (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): void => {
    const projectId = parseInt(req.query.projectId as string);
    if (isNaN(projectId)) {
      res.status(400).json({ error: 'Invalid or missing projectId query parameter' });
      return; // Explicitly return void in this error case
    }

    const filteredTestCases = testCases.filter(tc => tc.projectId === projectId);
    res.json(filteredTestCases);
  };
  app.get('/api/test-cases', getTestCases);

// Start the server
app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});