import express from "express";
import { db } from "./db.js";

// Add Branch
export const addBranch = async (req, res) => {
  const { college, branch, intake } = req.body;
  try {
    await db.query("BEGIN");

    const insertQuery = `
      INSERT INTO branches (college, name, intake)
      VALUES ($1, $2, $3)
    `;
    const insertValues = [college, branch, intake];
    await db.query(insertQuery, insertValues);

    await db.query("COMMIT");
    const htmlResponse = `
      <script>
        alert("Branch added successfully!");
        setTimeout(function() {
          window.location.href = '/manage-branches/add-form';
        }, 0);
      </script>
    `;
    res.status(201).send(htmlResponse);
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error adding branch:", error);

    const htmlResponse = `
      <script>
        alert("An error occurred while adding the branch.");
        setTimeout(function() {
          window.location.href = '/manage-branches/add-form';
        }, 0);
      </script>
    `;
    res.status(500).send(htmlResponse);
  }
};


// Edit Branch
export const editBranch = async (req, res) => {
  const { id } = req.params;
  const { college, branch, intake } = req.body;
  try {
    await db.query("UPDATE branches SET college = $1, name = $2, intake = $3 WHERE id = $4", [college, branch, intake, id]);
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
