// routes/ownerRoutes.js
import express from "express";
import uploadOwnerDocs from "../middlewares/uploadOwnerDocs.js";
import { registerOwner } from "../controllers/ownerController.js";

const router = express.Router();

// POST /api/owners/signup
router.post("/signup", uploadOwnerDocs, registerOwner);

export default router;
