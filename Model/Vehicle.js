// models/Vehicle.js
import mongoose from "mongoose";

const maintenanceLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  tasks: [{ type: String }],          // tasks performed
  repairCosts: [{ type: Number }],    // repair costs
  repairDescriptions: [{ type: String }],
});

const vehicleSchema = new mongoose.Schema(
  {
    // Car or Bike
    vehicleType: {
      type: String,
      enum: ["Car", "Bike"],
      required: true,
    },

    // Common
    brand: { type: String, required: true },         // Honda, Toyota, etc
    model: { type: String, required: true },         // Civic, CG125, etc
    year: { type: Number, required: true },

    // Car-specific fields (for bikes you can still fill some or leave optional where marked)
    rentRate: { type: Number, required: true },      // per day rate
    color: { type: String, required: true },
    variant: { type: String },                       // optional

    bodyType: {
      type: String,
      enum: ["Sedan", "SUV", "Hatchback", "Bike"],
      required: true,
    },

    mileage: { type: String, required: true },
    engineType: { type: String, required: true },    // 1.8L, 125cc etc

    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      required: function () {
        return this.vehicleType === "Car";
      },
    },

    seatCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    luggageCapacity: {
      type: Number,
      required: false, // for bikes you can skip
      min: 0,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      required: true,
    },

    carFeatures: { type: String }, // JSON string or comma-separated features

    images: [{ type: String }],

    availability: {
      type: String,
      enum: ["Available", "Rented Out", "In Maintenance", "Inactive"],
      default: "Available",
    },

    maintenanceLogs: [maintenanceLogSchema],
    fuelLevel: Number,

    rentalInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    // OWNER (single person listing)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema); // or "cars" if you want same collection
export default Vehicle;
