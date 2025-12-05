import express from "express";
import { saveAccount } from "../controllers/SignUpAccountController.js";

const router = express.Router()

router.post("/save-account", saveAccount)

export default router;
