import pool from "../config/db.js";

export async function getTestCasesByProject(req, res) {
  const { projectId } = req.params;

  try {
    const [testCases] = await pool.query(
      `SELECT tc.TestCase_ID AS id, tc.Title, df.Datafield_Name AS label, ft.Type_Name AS typeOfChoice,
              av.Value, av.defaultValue
       FROM TestCases tc
       JOIN Modules m ON tc.Module_ID = m.Module_ID
       JOIN Projects p ON m.Project_ID = p.Project_ID
       LEFT JOIN TestCaseDataField tdf ON tc.TestCase_ID = tdf.TestCase_ID
       LEFT JOIN DataFields df ON tdf.Datafield_ID = df.Datafield_ID
       LEFT JOIN Field_Types ft ON df.Field_Type_ID = ft.Field_Type_ID
       LEFT JOIN Available_Values av ON av.Datafield_ID = df.Datafield_ID
       WHERE p.Project_ID = ?`,
      [projectId]
    );

    // Grouping test cases with their test data
    const resultMap = {};

    for (const row of testCases) {
      if (!resultMap[row.id]) {
        resultMap[row.id] = {
          id: row.id,
          title: row.Title,
          testData: []
        };
      }

      if (row.label) {
        let field = resultMap[row.id].testData.find(td => td.label === row.label);
        if (!field) {
          field = {
            label: row.label,
            typeOfChoice: row.typeOfChoice,
            availableValues: [],
            defaultValue: null
          };
          resultMap[row.id].testData.push(field);
        }

        field.availableValues.push(row.Value);
        if (row.defaultValue) {
          field.defaultValue = row.Value;
        }
      }
    }

    res.json(Object.values(resultMap));
  } catch (err) {
    console.error('Error fetching test cases:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
