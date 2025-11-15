// controllers/vehicleController.js
import Vehicle from "../Model/Vehicle.js";

// POST /api/vehicles  (owner creates car/bike)
export const createVehicle = async (req, res) => {
  try {
    const {
      vehicleType,
      brand,
      model,
      year,
      rentRate,
      color,
      bodyType,
      mileage,
      engineType,
      transmission,
      seatCapacity,
      luggageCapacity,
      fuelType,
      carFeatures,
      variant,
    } = req.body;

    // basic validation
    if (
      !vehicleType ||
      !brand ||
      !model ||
      !year ||
      !rentRate ||
      !color ||
      !bodyType ||
      !mileage ||
      !engineType ||
      !seatCapacity ||
      !fuelType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const imagePaths = (req.files || []).map((file) => file.path);

    const vehicle = await Vehicle.create({
      vehicleType,
      brand,
      model,
      year,
      rentRate,
      color,
      bodyType,
      mileage,
      engineType,
      transmission: transmission || undefined,
      seatCapacity,
      luggageCapacity: luggageCapacity || undefined,
      fuelType,
      carFeatures,
      variant,
      images: imagePaths,
      userId: req.user.userId,
    });

    return res.status(201).json({
      message: "Vehicle listed successfully",
      vehicle,
    });
  } catch (err) {
    console.error("Error creating vehicle:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/vehicles/my  (all vehicles of logged-in owner)
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      userId: req.user.userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ vehicles });
  } catch (err) {
    console.error("Error fetching my vehicles:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/vehicles/:id  (public detail)
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findOne({
      _id: id,
      isDeleted: false,
    }).populate("userId", "ownerName contactNumber email");

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).json({ vehicle });
  } catch (err) {
    console.error("Error fetching vehicle:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/vehicles/:id  (owner updates own vehicle)
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findOne({
      _id: id,
      userId: req.user.userId,
      isDeleted: false,
    });

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found or not owned by you" });
    }

    const updatableFields = [
      "brand",
      "model",
      "year",
      "rentRate",
      "color",
      "bodyType",
      "mileage",
      "engineType",
      "transmission",
      "seatCapacity",
      "luggageCapacity",
      "fuelType",
      "carFeatures",
      "variant",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        vehicle[field] = req.body[field];
      }
    });

    // handle new images if sent
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map((f) => f.path);
      vehicle.images = vehicle.images.concat(newImagePaths);
    }

    await vehicle.save();

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (err) {
    console.error("Error updating vehicle:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/vehicles/:id/status  (change availability)
export const updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    if (!["Available", "Rented Out", "In Maintenance", "Inactive"].includes(availability)) {
      return res.status(400).json({ message: "Invalid availability status" });
    }

    const vehicle = await Vehicle.findOne({
      _id: id,
      userId: req.user.userId,
      isDeleted: false,
    });

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found or not owned by you" });
    }

    vehicle.availability = availability;
    await vehicle.save();

    return res.status(200).json({
      message: "Vehicle status updated",
      vehicle,
    });
  } catch (err) {
    console.error("Error updating vehicle status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/vehicles/:id  (soft delete)
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findOne({
      _id: id,
      userId: req.user.userId,
      isDeleted: false,
    });

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found or not owned by you" });
    }

    vehicle.isDeleted = true;
    vehicle.availability = "Inactive";
    await vehicle.save();

    return res.status(200).json({ message: "Vehicle deleted (soft)" });
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
