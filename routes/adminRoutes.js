// adminRoutes.js

import express from "express";
import { addUser, editUser, removeUser } from "./userController.js";
import { addBranch, editBranch, removeBranch, renderEditBranchPage,renderAddBranchPage } from "./branchController.js";


const router = express.Router();

// User Routes
router.post("/manage-users/add", addUser);
router.put("/manage-users/edit/:id", editUser);
router.delete("/manage-users/remove/:id", removeUser);

// Branch Routes
router.post('/manage-branches/add', addBranch);
router.post('/manage-branches/edit/:id', editBranch);
router.post('/manage-branches/remove/:id', removeBranch);

// Route to render the edit branch page
router.get('/manage-branches/add', renderAddBranchPage);
router.get('/manage-branches/edit', renderEditBranchPage);

export default router;