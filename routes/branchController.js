import { db } from './db.js';

// Function to render the edit branch page
export const renderEditBranchPage = async (req, res) => {
  try {
    res.render('edit_branch');
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).send('Internal Server Error');
  }
};
export const renderAddBranchPage = async (req, res) => {
  try {
    res.render('add_branch');
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).send('Internal Server Error');
  }
};
export const renderRemoveBranchPage = async (req, res) => {
  try {
    res.render('remove_branch');
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const addBranch = async (req, res) => {
  const { branchName } = req.body;
  try {
    const result = await db.query('INSERT INTO branches (name) VALUES ($1) RETURNING *', [branchName]);
    res.status(200).json({ message: 'Branch added successfully', branch: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error adding branch', error });
  }
};

export const editBranch = async (req, res) => {
  const { branchId, branchName } = req.body;
  try {
    const result = await db.query('UPDATE branches SET name = $1 WHERE id = $2 RETURNING *', [branchName, branchId]);
    res.status(200).json({ message: 'Branch edited successfully', branch: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error editing branch', error });
  }
};

export const removeBranch= async (req, res) => {
  var { college, branch } = req.body;
  branch = branch.toLowerCase();
  college = college.toLowerCase();
  
  try {
    // Check if the branch exists
    const branchExists = await db.query('SELECT * FROM college_data WHERE college=$1 and branch = $2', [college,branch]);
    if (branchExists.rows.length === 0) {
      return res.status(404).json({ message: 'Branch not found. Please try again with a valid branch ID' });
    }

    // Remove branch and college from the college_data table
    await db.query('DELETE FROM college_data WHERE branch = $1 AND college = $2', [branch, college]);
    res.status(200).json({ message: 'Branch and college removed successfully' });
  } catch (error) {
    console.error('Error removing branch and college:', error);
    res.status(500).json({ message: 'Error removing branch and college', error });
  }
};


export const getBranchesByCollege = async (req, res) => {
  try {
    const { college } = req.query;
    const query = "SELECT id, branch FROM college_data WHERE college = $1";
    const result = await db.query(query, [college]);
    res.json({ branches: result.rows });
  } catch (error) {
    console.error('Error fetching branches by college:', error);
    res.status(500).send('Internal Server Error');
  }
};



