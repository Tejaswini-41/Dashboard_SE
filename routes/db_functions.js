import { db } from "./db.js"; // Corrected import path

export async function verify_email_DB(email, picture) {
  // logic to verify email
  // Route handler logic for generating report
  try {
    // Fetch PostgreSQL version
    const result = await db.query(
      `SELECT user_type FROM accounts WHERE email = '${email}';`
    );

    // Check if result is empty or undefined
    if (!result || result.rows.length === 0) {
      console.log("Not registered user/admin");
      return null;
    }
    let user_type = result.rows[0].user_type;
    // console.log(user_type);

    const status = await db.query(
      `UPDATE accounts SET profile_pic = '${picture}' WHERE email = '${email}' RETURNING *;`
    );

    // console.log(status.rows);

    if (status.rowCount == 1) {
      return user_type;
    }
  } catch (error) {
    console.error("Error ", error);
    // Send error response
    return null;
  }
}

// Authentication middleware
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
