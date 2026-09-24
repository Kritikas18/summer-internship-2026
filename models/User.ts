import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "professional", "educator"],
    default: "student",
  },
  institution: String,
  avatar: String,
  isPremium: {
    type: Boolean,
    default: false,
  },
  studyHistory: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", UserSchema);