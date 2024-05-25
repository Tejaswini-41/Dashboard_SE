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
    var { college, branch, seat_type } = req.body;
    college = college.toLowerCase();
    branch = branch.toLowerCase();
    seat_type = seat_type.toLowerCase();

    let sqlQuery = "SELECT college, branch, ";

    if (seat_type === "nri") {
      sqlQuery += "nri_total AS total_seats, nri_filled AS total_filled, nri_vacant AS total_vacant, 'NRI' AS seat_type ";
    } else if (seat_type === "il") {
      sqlQuery += "il_total AS total_seats, il_filled AS total_filled, il_vacant AS total_vacant, 'IL' AS seat_type ";
    } else if (seat_type === "ciwgc") {
      sqlQuery += "ciwgc_total AS total_seats, ciwgc_filled AS total_filled, ciwgc_vacant AS total_vacant, 'CIWGC' AS seat_type ";
    } else if (seat_type === "other") {
      sqlQuery += "opf_total AS total_seats, opf_filled AS total_filled, opf_vacant AS total_vacant, 'Others' AS seat_type ";
    } else {
      sqlQuery += `
        nri_total AS nri_total_seats, nri_filled AS nri_total_filled, nri_vacant AS nri_total_vacant,
        il_total AS il_total_seats, il_filled AS il_total_filled, il_vacant AS il_total_vacant,
        ciwgc_total AS ciwgc_total_seats, ciwgc_filled AS ciwgc_total_filled, ciwgc_vacant AS ciwgc_total_vacant,
        opf_total AS opf_total_seats, opf_filled AS opf_total_filled, opf_vacant AS opf_total_vacant
      `;
    }

    sqlQuery += "FROM college_data WHERE 1 = 1";

    if (college !== "all") {
      sqlQuery += ` AND college = '${college}'`;
    }

    if (branch !== "all") {
      sqlQuery += ` AND branch = '${branch}'`;
    }

    const result = await db.query(sqlQuery);

    let dataResponse = [];
    if (seat_type === "all") {
      result.rows.forEach(row => {
        dataResponse.push({
          college: row.college,
          branch: row.branch,
          seat_type: 'NRI',
          total_seats: row.nri_total_seats,
          total_filled: row.nri_total_filled,
          total_vacant: row.nri_total_vacant
        });
        dataResponse.push({
          college: row.college,
          branch: row.branch,
          seat_type: 'IL',
          total_seats: row.il_total_seats,
          total_filled: row.il_total_filled,
          total_vacant: row.il_total_vacant
        });
        dataResponse.push({
          college: row.college,
          branch: row.branch,
          seat_type: 'CIWGC',
          total_seats: row.ciwgc_total_seats,
          total_filled: row.ciwgc_total_filled,
          total_vacant: row.ciwgc_total_vacant
        });
        dataResponse.push({
          college: row.college,
          branch: row.branch,
          seat_type: 'Other',
          total_seats: row.opf_total_seats,
          total_filled: row.opf_total_filled,
          total_vacant: row.opf_total_vacant
        });
      });
    } else {
      dataResponse = result.rows;
    }

    const data = {
      local: true,
      response: dataResponse,
    };

    res.render("view_data.ejs", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/report", ensureAuthenticated, async (req, res) => {
  try {
    const query = `
      SELECT 
        college,
        branch,
        CASE 
          WHEN nri_total > 0 THEN 'NRI'
          WHEN il_total > 0 THEN 'IL'
          WHEN ciwgc_total > 0 THEN 'CIWGC'
          ELSE 'Other'
        END AS seat_type,
        si AS total_seats,
        (nri_total + il_total + ciwgc_total + opf_total) AS total_filled,
        (si - (nri_total + il_total + ciwgc_total + opf_total)) AS total_vacant
      FROM 
        college_data
      ORDER BY 
        college ASC, branch ASC;
    `;

    const response = await db.query(query);
    
    res.render("report.ejs", {
      collegeData: response.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/report", ensureAuthenticated, (req, res) => {
  res.send("route not defined!");
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
