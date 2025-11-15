// routes/vehicleRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import uploadVehicleImages from "../middleware/uploadVehicleImages.js";
import {
  createVehicle,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle,
} from "../controller/vehicleController.js";

const router = express.Router();

// Owner creates car/bike listing
router.post(
  "/",
  auth(["owner"]),          // only owners can create
  uploadVehicleImages,
  createVehicle,
);

// Owner: list all my vehicles
router.get("/my", auth(["owner"]), getMyVehicles);

// Public: view one vehicle details
router.get("/:id", getVehicleById);

// Owner: update my vehicle
router.patch(
  "/:id",
  auth(["owner"]),
  uploadVehicleImages,
  updateVehicle,
);

// Owner: change availability
router.patch(
  "/:id/status",
  auth(["owner"]),
  updateVehicleStatus,
);

// Owner: delete (soft)
router.delete("/:id", auth(["owner"]), deleteVehicle);

export default router;
