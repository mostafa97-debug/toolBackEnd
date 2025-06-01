import pool from '../config/db.js';

export async function getProjectsForUser(req, res) {
  const userId = req.user.id;
  const [projects] = await pool.execute(`
    SELECT p.Project_ID, p.Project_Name, p.Project_Status
    FROM User_Projects up
    JOIN Project p ON up.Project_ID = p.Project_ID
    WHERE up.User_ID = ?
  `, [userId]);

  if (projects.length === 0) {
    return res.status(404).json({ message: 'No projects found for this user.' });
  }

  res.json(projects);
}
