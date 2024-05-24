import express from "express";
import { db } from "./db.js";
import { ensureAuthenticated } from "./db_functions.js";

const router = express.Router();

router.get("/student_info", ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM student_details ORDER BY id ASC");
    res.render("student_info.ejs", { students: result.rows });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/add_student", ensureAuthenticated, (req, res) => {
  res.render("add_student.ejs");
});

router.post("/add_student", ensureAuthenticated, async (req, res) => {
  const { first_name, last_name, mobile, email, enrolment_no, seat_type, candidate_type, college, branch, fee_status, doa } = req.body;

  try {
    await db.query("BEGIN");

    const updateQuery = `
      UPDATE seat_data
      SET filled = filled + 1, vacant = vacant - 1
      WHERE college = $1
      AND branch = $2
      AND seat_type = $3
      AND vacant > 0
      RETURNING *;
    `;
    const updateValues = [college, branch, seat_type];
    const updateResult = await db.query(updateQuery, updateValues);

    if (updateResult.rowCount === 0) {
      await db.query("ROLLBACK");
      const htmlResponse = `
        <script>
          alert("No vacant seats available...");
          setTimeout(function() {
            window.location.href = '/';
          }, 0);
        </script>
      `;
      res.status(404).send(htmlResponse);
    } else {
      const insertQuery = `
        INSERT INTO student_details (first_name, last_name, mobile, email, enrolment_no, seat_type, candidate_type, college, branch, fee_status, doa)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;
      const insertValues = [first_name, last_name, mobile, email, enrolment_no, seat_type, candidate_type, college, branch, fee_status, doa];
      await db.query(insertQuery, insertValues);

      await db.query("COMMIT");
      res.redirect("/student_info");
    }
  } catch (error) {
    await db.query("ROLLBACK");

    if (error.code === "23505") {
      const htmlResponse = `
        <script>
          alert("Data already exists.");
          setTimeout(function() {
            window.location.href = '/';
          }, 0);
        </script>
      `;
      res.status(400).send(htmlResponse);
    } else {
      console.error("Error adding student data:", error);
      const htmlResponse = `
        <script>
          alert("An error occurred while adding student data.");
          setTimeout(function() {
            window.location.href = '/';
          }, 0);
        </script>
      `;
      res.status(500).send(htmlResponse);
    }
  }
});

router.get("/student_details", ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM student_details ORDER BY id ASC");
    res.render("student_details", { students: result.rows });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/update_student/:email", ensureAuthenticated, async (req, res) => {
  const email = req.params.email;

  try {
    const result = await db.query("SELECT * FROM student_details WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).send("Student not found");
    }
    const student = result.rows[0];
    res.render("update_student.ejs", { student });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update_student/:email", ensureAuthenticated, async (req, res) => {
  const { first_name, last_name, mobile, enrolment_no, seat_type, candidate_type, college, branch, fee_status, doa } = req.body;
  const email = req.params.email;

  const validCollege = college.toLowerCase();
  const validBranch = branch.toLowerCase();
  const validFeeStatus = fee_status.toLowerCase();

  try {
    await db.query("UPDATE student_details SET first_name = $1, last_name = $2, mobile = $3, enrolment_no = $4, seat_type = $5, candidate_type = $6, college = $7, branch = $8, fee_status = $9, doa = $10 WHERE email = $11", 
    [first_name, last_name, mobile, enrolment_no, seat_type, candidate_type, validCollege, validBranch, validFeeStatus, doa, email]);
    res.redirect("/student_info");
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/remove_student/:email", ensureAuthenticated, async (req, res) => {
  try {
    const email = req.params.email;
    await db.query("DELETE FROM student_details WHERE email = $1", [email]);
    res.redirect("/student_info");
  } catch (error) {
    console.error("Error removing student data:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;