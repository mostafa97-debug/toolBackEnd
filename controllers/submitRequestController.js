import pool from '../config/db.js';

export const submitAutomationRequest = async (req, res) => {
  const userId = req.user.id;
  const modules = req.body; // modules like MazayaModule, LeavesModule, etc.

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into Automation_Requests
    const [requestResult] = await connection.execute(
      `INSERT INTO Automation_Requests (Request_Date, User_ID, Request_Status)
       VALUES (NOW(), ?, ?)`,
      [userId, 'Pending']
    );

    const requestId = requestResult.insertId;

    // 2. Loop through modules and test cases
    for (const moduleName in modules) {
      const testCases = modules[moduleName];

      for (const testCase of testCases) {
        const testCaseName = testCase.name;

        // 2a. Insert into Request_TestCases
        const [testCaseResult] = await connection.execute(
          `INSERT INTO Request_TestCases (Request_ID, TestCase_Name, Module_Name, Request_testCase_Status)
           VALUES (?, ?, ?, ?)`,
          [requestId, testCaseName, moduleName, 'Pending']
        );

        const testCaseId = testCaseResult.insertId;

        // 2b. Insert datafields
        for (const field of testCase.dataFields) {
          const { name, value, iteration } = field;

          await connection.execute(
            `INSERT INTO Request_datafields (datafield_Name, datafield_Value, Request_TestCases_ID, Iteration)
             VALUES (?, ?, ?, ?)`,
            [name, value, testCaseId, iteration ?? 1]
          );
        }
      }
    }

    await connection.commit();
    res.status(201).json({ message: 'Automation request submitted', requestId });

  } catch (err) {
    await connection.rollback();
    console.error('Error in submitAutomationRequest:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};
