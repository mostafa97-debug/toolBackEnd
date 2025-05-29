import pool from '../config/db.js';

/**
 * Get test cases and related data for authorized projects
 */
export const getTestCasesForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.query.projectId; // optional

    const [rows] = await pool.execute(
      `
      SELECT 
        tc.ID AS testCaseId,
        tc.Name AS testCaseTitle,
        m.ID AS moduleId,
        m.Name AS moduleName,
        p.Project_ID AS projectId,
        p.Project_Name AS projectName,
        df.Datafield_Name AS dataLabel,
        df.Field_Type_ID AS fieldType,
        av.Value AS availableValue,
        av.defaultValue AS isDefault
      FROM test_cases tc
      JOIN module m ON tc.Module_ID = m.ID
      JOIN project p ON m.Project_ID = p.Project_ID
      JOIN user_projects up ON p.Project_ID = up.Project_ID
      JOIN users u ON u.ID = up.User_ID
      LEFT JOIN testcase_datafields tdf ON tc.ID = tdf.TestCase_ID
      LEFT JOIN datafields df ON df.Datafield_ID = tdf.Datafield_ID
      LEFT JOIN available_values av ON av.Datafield_ID = df.Datafield_ID
      WHERE u.ID = ?
      ${projectId ? 'AND p.Project_ID = ?' : ''}
      ORDER BY tc.ID, df.Datafield_ID, av.ID
      `,
      projectId ? [userId, projectId] : [userId]
    );

    const testCaseMap = {};

    for (const row of rows) {
      if (!testCaseMap[row.testCaseId]) {
        testCaseMap[row.testCaseId] = {
          id: row.testCaseId,
          title: row.testCaseTitle,
          project: row.projectName,
          module: row.moduleName,
          testData: []
        };
      }

      const testCase = testCaseMap[row.testCaseId];

      if (row.dataLabel) {
        let field = testCase.testData.find(d => d.label === row.dataLabel);
        if (!field) {
          field = {
            label: row.dataLabel,
            type: row.fieldType === 1 ? 'single' : 'multi',
            defaultValue: null,
            availableValues: []
          };
          testCase.testData.push(field);
        }

        if (row.availableValue && !field.availableValues.includes(row.availableValue)) {
          field.availableValues.push(row.availableValue);
        }

        if (row.isDefault) {
          field.defaultValue = row.availableValue;
        }
      }
    }

    const testCases = Object.values(testCaseMap);
    res.json(testCases);
  } catch (err) {
    console.error('Error fetching test cases:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
