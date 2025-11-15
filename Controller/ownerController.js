// controllers/ownerController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Signup.js";         // your Users model file
import OwnerProfile from "../models/OwnerProfile.js";

export const registerOwner = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      idNumber,              // CNIC / ID
      drivingLicenseNumber,
      address,
    } = req.body;

    // 1. Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !idNumber ||
      !drivingLicenseNumber
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields" });
    }

    // 2. Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered" });
    }

    // 3. Validate uploaded files
    const drivingLicenseImagePath =
      req.files?.drivingLicenseImage?.[0]?.path;
    const idCardImagePath =
      req.files?.idCardImage?.[0]?.path;
    const profileImagePath =
      req.files?.profileImage?.[0]?.path;

    if (!drivingLicenseImagePath || !idCardImagePath || !profileImagePath) {
      return res.status(400).json({
        message:
          "drivingLicenseImage, idCardImage and profileImage are required",
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create base user (in Users collection) with role 'owner'
    const user = await Users.create({
      showroomName: null,                           // not needed for single person
      ownerName: `${firstName} ${lastName}`,
      cnic: idNumber,
      contactNumber: phoneNumber,
      address: address || "",
      email,
      password: hashedPassword,
      role: "owner",
      images: [],                                   // you can use later
    });

    // 6. Create OwnerProfile document
    const ownerProfile = await OwnerProfile.create({
      user: user._id,
      firstName,
      lastName,
      phoneNumber,
      idNumber,
      drivingLicenseNumber,
      drivingLicenseImage: drivingLicenseImagePath,
      idCardImage: idCardImagePath,
      profileImage: profileImagePath,
      verificationStatus: "pending",
    });

    // 7. Create JWT token for login session
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      message: "Owner registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      ownerProfile,
    });
  } catch (error) {
    console.error("Error registering owner:", error);
    return res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
