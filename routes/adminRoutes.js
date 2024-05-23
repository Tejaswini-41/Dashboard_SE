import express from "express";
import { addUser, editUser, removeUser } from ".userController.js";
import { addBranch, editBranch, removeBranch } from "./branchController.js";
import { addIntake, editIntake, removeIntake } from "./intakeController.js";


const router = express.Router();



// User Routes
router.post("/manage-users/add", addUser);
router.put("/manage-users/edit/:id", editUser);
router.delete("/manage-users/remove/:id", removeUser);

// Branch Routes
router.post('/manage-branches/add', addBranch);
router.post('/manage-branches/edit', editBranch);
router.post('/manage-branches/remove', removeBranch);

// Intake Routes
router.post("/manage-intake/add", addIntake);
router.put("/manage-intake/edit/:id", editIntake);
router.delete("/manage-intake/remove/:id", removeIntake);

export default router;
