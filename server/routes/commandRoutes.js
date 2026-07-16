import express from "express";

import {
  executeCommand,
} from "../controllers/commandController.js";

const router = express.Router();

/*
==========================================
Business Command Center
POST /api/command
==========================================
*/

router.post("/", executeCommand);

export default router;