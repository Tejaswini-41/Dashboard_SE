import express from "express";
import { db } from "./db.js";
import { names } from "./data.js";
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
    const { college, branch, si, seat_type } = req.body;

    let sqlQuery = "SELECT * FROM parent_table WHERE 1=1"; // Start with WHERE 1=1

    if (college !== "all") {
      sqlQuery += ` AND college = '${college}'`;
    }

    if (branch !== "all") {
      sqlQuery += ` AND branch = '${branch}'`;
    }

    // Correct the comparison for the si condition if it's a column name
    if (si !== "60") {
      sqlQuery += ` AND si = '${si}'`;
    }

    if (seat_type !== "all") {
      sqlQuery += ` AND seat_type = '${seat_type}'`;
    }

    const result = await db.query(sqlQuery);

    const data = {
      local: true,
      response: result.rows,
      names: names,
    };

    res.render("view_data.ejs", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/report", ensureAuthenticated, async (req, res) => {
  try {
    // Your code for generating report
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/report", ensureAuthenticated, (req, res) => {
  res.send("route not defined!");
});

export default router;
