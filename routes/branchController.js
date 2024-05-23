import { db } from './db.js';

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

export const removeBranch = async (req, res) => {
  const { branchId } = req.body;
  try {
    await db.query('DELETE FROM branches WHERE id = $1', [branchId]);
    res.status(200).json({ message: 'Branch removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing branch', error });
  }
};
