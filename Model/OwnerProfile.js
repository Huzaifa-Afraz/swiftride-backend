// models/OwnerProfile.js
import mongoose from "mongoose";

const ownerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true, // one owner profile per user
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    phoneNumber: { type: String, required: true },

    // Govt ID / CNIC
    idNumber: { type: String, required: true },

    // Driving license
    drivingLicenseNumber: { type: String, required: true },
    drivingLicenseImage: { type: String, required: true }, // file path

    // ID photo
    idCardImage: { type: String, required: true }, // e.g. CNIC card scan

    // Owner face pic
    profileImage: { type: String, required: true },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const OwnerProfile = mongoose.model("OwnerProfile", ownerProfileSchema);
export default OwnerProfile;
