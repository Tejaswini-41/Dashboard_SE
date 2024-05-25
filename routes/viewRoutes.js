import express from "express";
import { db } from "./db.js";
import { ensureAuthenticated } from "./db_functions.js";

const router = express.Router();

router.get("/view_data", ensureAuthenticated, async (req, res) => {
  try {
    const data = {
      local: false,
    };
    res.render("view_data.ejs", { data });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/view_data", ensureAuthenticated, async (req, res) => {
  try {
    let { college, branch, seat_type } = req.body;
    college = college.toLowerCase();
    branch = branch.toLowerCase();
    seat_type = seat_type.toUpperCase(); // Convert to uppercase to match column names

    let sqlQuery = "SELECT * FROM college_data WHERE 1 = 1";

    if (college !== "all") {
      sqlQuery += ` AND college = '${college}'`;
    }

    if (branch !== "all") {
      sqlQuery += ` AND branch = '${branch}'`;
    }

    if (seat_type !== "ALL") {
      // Construct the column name based on the seat type
      const column = seat_type.toLowerCase() + "_total";
      sqlQuery += ` AND ${column} > 0`;
    }

    const result = await db.query(sqlQuery);
    const data = {
      local: true,
      response: result.rows,
    };

    res.render("view_data.ejs", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/branches", ensureAuthenticated, async (req, res) => {
  try {
    const { college } = req.query;
    let query;
    if (college === "all") {
      query = "SELECT DISTINCT branch FROM college_data";
    } else {
      query = "SELECT DISTINCT branch FROM college_data WHERE college = $1";
    }
    const result = await db.query(query, college === "all" ? [] : [college]);
    res.json({ branches: result.rows });
  } catch (error) {
    console.error("Error fetching branches by college:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
