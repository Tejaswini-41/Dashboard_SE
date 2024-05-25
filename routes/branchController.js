import { db } from './db.js';

// Function to render the edit branch page
export const renderAddBranchPage = async (req, res) => {
  try {
    res.render('add_branch');
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).send('Internal Server Error');
  }
};
export const renderEditIntakePage = async (req, res) => {
  try {
    res.render('editIntake_branch');
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).send('Internal Server Error');
  }
};
export const renderupdateSeatsPage = async (req, res) => {
  try {
    res.render('updateSeats_branch');
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).send('Internal Server Error');
  }
};
export const renderRemoveBranchPage = async (req, res) => {
  try {
    res.render('remove_branch');
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const addBranch = async (req, res) => {
  var { college, branch, intake, nri, il, ciwgc, other } = req.body;
  // Calculate seats based on selected options
  college = college.toLowerCase();
  branch = branch.toLowerCase();
  const totalSeats = parseInt(intake);
  let nriSeats = 0, ilSeats = 0, ciwgcSeats = 0, otherSeats = 0;

  if (il && !nri) {
    ilSeats = Math.floor(0.20 * totalSeats);
  }
  else if (il && nri) {
    nriSeats = Math.ceil(0.05 * totalSeats);
    ilSeats = Math.floor(0.15 * totalSeats);
  }

  const remainingSeats = totalSeats - (nriSeats + ilSeats);

  if (ciwgc) {
    ciwgcSeats = Math.floor((0.333333334) * totalSeats * 0.15);
  }

  if (other) {
    otherSeats = Math.floor((0.66666667) * totalSeats * 0.15);
  }

  try {
    // Check if the branch already exists in the same college
    const branchExists = await db.query('SELECT * FROM college_data WHERE college = $1 AND branch = $2', [college, branch]);
    if (branchExists.rows.length > 0) {
      // If the branch already exists, update its data
      const htmlResponse = `
        <script>
          alert("Branch Already Exits");
          setTimeout(function() {
            window.location.href = '/manage-branches/add';
          }, 0);
        </script>
      `;
      return res.status(500).send(htmlResponse);
      // res.status(200).json({ message: 'Branch and intake updated successfully', branch: result.rows[0] });
    } else {
      // If the branch doesn't exist, insert a new entry
      const result = await db.query(
        'INSERT INTO college_data (college, branch, si, nri_total,nri_filled,nri_vacant,il_total,il_filled,il_vacant, ciwgc_total,ciwgc_filled,ciwgc_vacant, opf_total,opf_filled,opf_vacant) VALUES ($1, $2, $3, $4, 0, $4, $5,0,$5,$6,0,$6,$7,0,$7) RETURNING *',
        [college, branch, totalSeats, nriSeats, ilSeats, ciwgcSeats, otherSeats]
      );
      const htmlResponse = `
        <script>
          alert("Branch Added");
          setTimeout(function() {
            window.location.href = '/admin';
          }, 0);
        </script>
      `;
      return res.status(500).send(htmlResponse);
    }
  } catch (error) {
    console.error('Error adding branch and intake:', error);
    res.status(400).json({ message: 'Error adding branch and intake', error });
  }
};


export const editIntakeBranch = async (req, res) => {
  var { college, branch, intake, nri, il, ciwgc, other } = req.body;
  // Calculate seats based on selected options
  college = college.toLowerCase();
  branch = branch.toLowerCase();
  const totalSeats = parseInt(intake);
  let nriSeats = 0, ilSeats = 0, ciwgcSeats = 0, otherSeats = 0;

  if (il && !nri) {
    ilSeats = Math.floor(0.20 * totalSeats);
  }
  else if (il && nri) {
    nriSeats = Math.ceil(0.05 * totalSeats);
    ilSeats = Math.floor(0.15 * totalSeats);
  }

  if (ciwgc) {
    ciwgcSeats = Math.floor((0.333333334) * totalSeats * 0.15);
  }

  if (other) {
    otherSeats = Math.floor((0.66666667) * totalSeats * 0.15);
  }

  try {
      const result = await db.query(
        'UPDATE college_data SET si = $3, nri_total = $4, il_total = $5, il_filled=0, il_vacant=$5 , ciwgc_total = $6, ciwgc_filled=0, ciwgc_vacant=$6 , opf_total = $7 , opf_filled=0, opf_vacant=$7  WHERE college = $1 AND branch = $2 RETURNING *',
        [college, branch, totalSeats, nriSeats, ilSeats, ciwgcSeats, otherSeats]
      );
      const htmlResponse = `
        <script>
          alert("Branch Intake Updated");
          setTimeout(function() {
            window.location.href = '/admin';
          }, 0);
        </script>
      `;
      return res.status(500).send(htmlResponse);
    
  } catch (error) {
    const htmlResponse = `
        <script>
          alert("Error");
          setTimeout(function() {
            window.location.href = '/manage-branches/editIntake';
          }, 0);
        </script>
      `;
      return res.status(500).send(htmlResponse);
  }
};

export const updateSeatsBranch = async (req, res) => {
  var { college, branch, intake, nri, il, ciwgc, other } = req.body;
  // Calculate seats based on selected options
  college = college.toLowerCase();
  branch = branch.toLowerCase();
  const totalSeats = parseInt(intake);
  let nriSeats = 0, ilSeats = 0, ciwgcSeats = 0, otherSeats = 0;

  if (nri) {
    nriSeats = Math.ceil(0.05 * totalSeats);
  }

  if (il) {
    ilSeats = Math.floor(0.15 * totalSeats);
  }

  const remainingSeats = totalSeats - (nriSeats + ilSeats);

  if (ciwgc) {
    ciwgcSeats = Math.floor((0.333333334) * totalSeats * 0.15);
  }

  if (other) {
    otherSeats = Math.floor((0.66666667) * totalSeats * 0.15);
  }

  try {
    // Check if the branch already exists in the same college
    const branchExists = await db.query('SELECT * FROM college_data WHERE college = $1 AND branch = $2', [college, branch]);
    if (branchExists.rows.length > 0) {
      // If the branch already exists, update its data
      const htmlResponse = `
        <script>
          alert("Branch Already Exits");
          setTimeout(function() {
            window.location.href = '/manage-branches/add';
          }, 0);
        </script>
      `;
      return res.status(500).send(htmlResponse);
      // res.status(200).json({ message: 'Branch and intake updated successfully', branch: result.rows[0] });
    } else {
      // If the branch doesn't exist, insert a new entry
      const result = await db.query(
        'INSERT INTO college_data (college, branch, si, nri_total,nri_filled,nri_vacant,il_total,il_filled,il_vacant, ciwgc_total,ciwgc_filled,ciwgc_vacant, opf_total,opf_filled,opf_vacant) VALUES ($1, $2, $3, $4, 0, $4, $5,0,$5,$6,0,$6,$7,0,$7) RETURNING *',
        [college, branch, totalSeats, nriSeats, ilSeats, ciwgcSeats, otherSeats]
      );
      const htmlResponse = `
        <script>
          alert("Branch Added");
          setTimeout(function() {
            window.location.href = '/admin';
          }, 0);
        </script>
      `;
      return res.status(500).send(htmlResponse);
    }
  } catch (error) {
    console.error('Error adding branch and intake:', error);
    res.status(400).json({ message: 'Error adding branch and intake', error });
  }
};



export const removeBranch= async (req, res) => {
  var { college, branch } = req.body;
  branch = branch.toLowerCase();
  college = college.toLowerCase();
  
  try {
    // Check if the branch exists
    const branchExists = await db.query('SELECT * FROM college_data WHERE college=$1 and branch = $2', [college,branch]);
    if (branchExists.rows.length === 0) {
      const htmlResponse = `
      <script>
        alert("Branch Not Found");
        setTimeout(function() {
          window.location.href = '/manage-branches/remove';
        }, 0);
      </script>
    `;
    return res.status(500).send(htmlResponse);
    }

    // Remove branch and college from the college_data table
    await db.query('DELETE FROM college_data WHERE branch = $1 AND college = $2', [branch, college]);
    const htmlResponse = `
        <script>
          alert("Branch Removed");
          setTimeout(function() {
            window.location.href = '/admin';
          }, 0);
        </script>
      `;
      return res.status(500).send(htmlResponse);
  } catch (error) {
    console.error('Error removing branch and college:', error);
    res.status(500).json({ message: 'Error removing branch and college', error });
  }
};


export const getBranchesByCollege = async (req, res) => {
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
};



