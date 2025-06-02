import pool from '../config/db.js';

export const getModulesByProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.query;

    // Validate projectId presence
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required as a query parameter' });
    }

    // Validate projectId is a number
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'projectId must be a valid number' });
    }

    // Check if the user is authorized for this project
    const [projectAccess] = await pool.execute(
      `SELECT 1 FROM user_projects WHERE User_ID = ? AND Project_ID = ?`,
      [userId, projectId]
    );

    if (!projectAccess.length) {
      return res.status(403).json({ error: 'You are not authorized to access this project' });
    }

    // Fetch modules for the project
    const [modules] = await pool.execute(
      `SELECT ID, Name FROM module WHERE Project_ID = ?`,
      [projectId]
    );

    res.json(modules);

  } catch (err) {
    console.error('Error fetching modules:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
