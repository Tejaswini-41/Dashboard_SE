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
    const { college, branch, seat_type } = req.body;

    let sqlQuery = "SELECT * FROM seat_data WHERE 1 = 1";

    if (college !== "all") {
      sqlQuery += ` AND college = '${college}'`;
    }

    if (branch !== "all") {
      sqlQuery += ` AND branch = '${branch}'`;
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
    const query = `SELECT 
        college,
        branch,
        SUM(CASE WHEN seat_type = 'NRI' THEN intake ELSE 0 END) AS nri_intake,
        SUM(CASE WHEN seat_type = 'NRI' THEN filled ELSE 0 END) AS nri_filled,
        SUM(CASE WHEN seat_type = 'NRI' THEN vacant ELSE 0 END) AS nri_vacant,
        SUM(CASE WHEN seat_type = 'OCI' THEN intake ELSE 0 END) AS oci_intake,
        SUM(CASE WHEN seat_type = 'OCI' THEN filled ELSE 0 END) AS oci_filled,
        SUM(CASE WHEN seat_type = 'OCI' THEN vacant ELSE 0 END) AS oci_vacant,
        SUM(CASE WHEN seat_type = 'FN' THEN intake ELSE 0 END) AS fn_intake,
        SUM(CASE WHEN seat_type = 'FN' THEN filled ELSE 0 END) AS fn_filled,
        SUM(CASE WHEN seat_type = 'FN' THEN vacant ELSE 0 END) AS fn_vacant,
        SUM(CASE WHEN seat_type = 'PIO' THEN intake ELSE 0 END) AS pio_intake,
        SUM(CASE WHEN seat_type = 'PIO' THEN filled ELSE 0 END) AS pio_filled,
        SUM(CASE WHEN seat_type = 'PIO' THEN vacant ELSE 0 END) AS pio_vacant,
        SUM(CASE WHEN seat_type = 'CIWGC' THEN intake ELSE 0 END) AS ciwgc_intake,
        SUM(CASE WHEN seat_type = 'CIWGC' THEN filled ELSE 0 END) AS ciwgc_filled,
        SUM(CASE WHEN seat_type = 'CIWGC' THEN vacant ELSE 0 END) AS ciwgc_vacant,
        SUM(intake) AS total_intake,
        SUM(filled) AS total_filled,
        SUM(vacant) AS total_vacant
        FROM 
        seat_data
        GROUP BY 
        college, branch
        ORDER BY 
        college ASC, branch ASC; `;

    const response = await db.query(query);
    // console.log(response.rows);

    res.render("report.ejs", {
      collegeData: response.rows,
      names: names,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/report", ensureAuthenticated, (req, res) => {
  res.send("route not defined!");
});

export default router;