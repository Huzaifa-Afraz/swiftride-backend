// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",      // ✅ was Users_data
      required: true,    // client who is renting
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",    // or "cars" if you used that
      required: true,
    },
    // For single owner listing, showroomId = owner user id
    showroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",      // ✅ was Users_data
      required: true,
    },
    rentalStartDate: {
      type: String,
      required: true,
    },
    rentalStartTime: {
      type: String,
      required: true,
    },
    rentalEndDate: {
      type: String,
      required: true,
    },
    rentalEndTime: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",          // client requested
        "approved",         // owner approved (active rental)
        "rejected",         // owner rejected
        "return initiated", // client says "I want to return"
        "pending payment",  // after return, payment remaining
        "returned",         // fully returned + settled
      ],
      default: "pending",
    },
    repairDescriptions: {
      type: Object,
      default: {},
    },
    invoiceUrls: [String],
    currentInvoiceUrl: {
      type: String,
      default: "",
    },
    overdueHours: {
      type: Number,
      default: 0,
    },
    overdueCharge: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
