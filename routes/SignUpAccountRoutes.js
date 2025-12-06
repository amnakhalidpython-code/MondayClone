import express from "express";
import { saveAccount, getAccount } from "../controllers/SignUpAccountController.js"; // ADD getAccount

const router = express.Router();

router.post("/save-account", saveAccount);
router.post("/get-account", getAccount); // ADD THIS LINE

export default router;