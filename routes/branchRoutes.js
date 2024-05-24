import express from "express";
import { db } from "./db.js";
import { ensureAuthenticated } from "./db_functions.js";

const router = express.Router();

// Get all branches
router.get("/branches", ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM branches");
    res.render("branches", { branches: result.rows });
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get add branch form
router.get("/add_branch", ensureAuthenticated, (req, res) => {
  res.render("add_branch.ejs");
});

// Add a new branch
router.post("/add_branch", ensureAuthenticated, async (req, res) => {
  const { name, intake } = req.body;

  try {
    await db.query("INSERT INTO branches (name, intake) VALUES ($1, $2)", [name, intake]);
    res.redirect("/branches");
  } catch (error) {
    console.error("Error adding branch:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get update branch form
router.get("/update_branch/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM branches WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Branch not found");
    }
    res.render("update_branch.ejs", { branch: result.rows[0] });
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update a branch
router.post("/update_branch/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, intake } = req.body;

  try {
    await db.query("UPDATE branches SET name = $1, intake = $2 WHERE id = $3", [name, intake, id]);
    res.redirect("/branches");
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Remove a branch
router.post("/remove_branch/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM branches WHERE id = $1", [id]);
    res.redirect("/branches");
  } catch (error) {
    console.error("Error removing branch:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
