import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  loan: {
    type: Number,
    default: 0,
  },
  walletAddress: {
    type: String,
    default: "",
  }
});

const User = mongoose.model("User", userSchema);

export default User;
