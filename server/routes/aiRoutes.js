import express from "express";

import {
  parseInventoryPrompt,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/parse", parseInventoryPrompt);

export default router;