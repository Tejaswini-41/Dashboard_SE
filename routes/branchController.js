import { db } from "./db.js";

// Add Branch
export const addBranch = async (req, res) => {
  const { name, intake } = req.body;
  try {
    await db.query("INSERT INTO branches (name, intake) VALUES ($1, $2)", [name, intake]);
    res.status(201).send("Branch added successfully");
  } catch (error) {
    console.error("Error adding branch:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Edit Branch
export const editBranch = async (req, res) => {
  const { id } = req.params;
  const { name, intake } = req.body;
  try {
    await db.query("UPDATE branches SET name = $1, intake = $2 WHERE id = $3", [name, intake, id]);
    res.status(200).send("Branch updated successfully");
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Remove Branch
export const removeBranch = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM branches WHERE id = $1", [id]);
    res.status(200).send("Branch removed successfully");
  } catch (error) {
    console.error("Error removing branch:", error);
    res.status(500).send("Internal Server Error");
  }
};
