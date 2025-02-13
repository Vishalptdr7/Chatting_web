import mongoose from "mongoose";
import jwt from "jsonwebtoken";


const tempUserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
});

const TempUser = mongoose.model("TempUser", tempUserSchema);

export { TempUser };
