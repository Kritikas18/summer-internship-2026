import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  role: String,
  institution: String,
  avatar: String,
  isPremium: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", UserSchema);