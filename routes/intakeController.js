import { db } from "./db.js";

// Add Intake
export const addIntake = async (req, res) => {
  const { college, branch, seat_type, filled, vacant } = req.body;
  try {
    await db.query("INSERT INTO seat_data (college, branch, seat_type, filled, vacant) VALUES ($1, $2, $3, $4, $5)", [college, branch, seat_type, filled, vacant]);
    res.status(201).send("Intake added successfully");
  } catch (error) {
    console.error("Error adding intake:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Edit Intake
export const editIntake = async (req, res) => {
  const { id } = req.params;
  const { college, branch, seat_type, filled, vacant } = req.body;
  try {
    await db.query("UPDATE seat_data SET college = $1, branch = $2, seat_type = $3, filled = $4, vacant = $5 WHERE id = $6", [college, branch, seat_type, filled, vacant, id]);
    res.status(200).send("Intake updated successfully");
  } catch (error) {
    console.error("Error updating intake:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Remove Intake
export const removeIntake = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM seat_data WHERE id = $1", [id]);
    res.status(200).send("Intake removed successfully");
  } catch (error) {
    console.error("Error removing intake:", error);
    res.status(500).send("Internal Server Error");
  }
};
