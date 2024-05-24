import express from "express";
import bodyParser from "body-parser"; // Add this line for bodyParser import express from "express";
import { db } from "./db.js"; // Corrected import path
import { ensureAuthenticated } from "./db_functions.js";
import { addUser } from "./userController.js";

const router = express.Router();

router.post("/manage-users/add", addUser);

// Route handler for rendering the admin.ejs page
router.get("/admin", ensureAuthenticated, async (req, res) => {
  try {
    // Render the admin.ejs view
    res.render("admin");
  } catch (error) {
    console.error("Error rendering admin page:", error);
    // Send error response
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/editUser', async (req, res) => {
  try {
      const { id } = req.query;
      const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      res.render('editUser', { user: user.rows[0] });
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get("/pg_version", ensureAuthenticated, async (req, res) => {
  // Route handler logic for generating report
  try {
    // Fetch PostgreSQL version
    const result = await db.query("select version()");

    // Check if result is empty or undefined
    if (!result || result.rows.length === 0) {
      throw new Error("PostgreSQL version not found");
    }

    // Send response with PostgreSQL version
    res.render("version.ejs", { versionInfo: result.rows[0].version });
  } catch (error) {
    console.error("Error fetching PostgreSQL version:", error);
    // Send error response
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;