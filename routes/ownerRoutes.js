// routes/ownerRoutes.js
import express from "express";
import uploadOwnerDocs from "../middleware/uploadOwnerDocs.js";
import { registerOwner } from "../controller/ownerController.js";

const router = express.Router();

// POST /api/owners/signup
router.post("/signup", uploadOwnerDocs, registerOwner);

export default router;
