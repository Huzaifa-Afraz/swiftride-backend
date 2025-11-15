import express from "express";
import {
  bookCar,
  updateBooking,
  cancelBooking,
  getUserBookings,
  returnCar,
  extendBooking,
  GetBookingDetail,
   createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  initiateReturn,
  markReturned,
} from "../Controller/bookingController.js";
import { verifyToken } from "../Middleware/verifyToken.js";
import auth from "../middleware/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.post("/book", verifyToken, bookCar);
router.put("/update/:bookingId", verifyToken, updateBooking);
router.delete("/cancel/:bookingId", verifyToken, cancelBooking);
router.get("/my-bookings", verifyToken, getUserBookings);
router.patch("/extend-booking/:bookingId", verifyToken, extendBooking);
router.post("/returncar/:BookingId", verifyToken, returnCar);
router.get("/bookcar-detail/:bookingId", verifyToken, GetBookingDetail);
router.get("/invoices/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../invoices", req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading the invoice:", err);
      res.status(404).send("Invoice not found");
    }
  });
});
// CLIENT routes
router.post("/", auth(["client"]), createBooking);
router.get("/my", auth(["client"]), getMyBookings);
router.patch("/:id/initiate-return", auth(["client"]), initiateReturn);

// OWNER routes
router.get("/owner", auth(["owner"]), getOwnerBookings);
router.patch("/:id/approve", auth(["owner"]), approveBooking);
router.patch("/:id/reject", auth(["owner"]), rejectBooking);
router.patch("/:id/mark-returned", auth(["owner"]), markReturned);

export default router;
