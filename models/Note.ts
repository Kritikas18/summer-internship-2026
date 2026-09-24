import mongoose from "mongoose";

const NoteVersionSchema = new mongoose.Schema({
  id: String,
  version: Number,
  updatedAt: Date,
  updatedBy: String,
  title: String,
  content: String,
  changeSummary: String,
}, { _id: false });

const AnnotationSchema = new mongoose.Schema({
  id: String,
  page: Number,
  x: Number,
  y: Number,
  text: String,
  author: String,
  createdAt: Date,
}, { _id: false });

const CommentSchema = new mongoose.Schema({
  id: String,
  userId: String,
  userName: String,
  userAvatar: String,
  text: String,
  rating: Number,
  createdAt: Date,
}, { _id: false });

const NoteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  content: { type: String, required: true },

  subject: { type: String, required: true },
  institution: { type: String, required: true },
  tags: [String],

  creatorId: String,
  creatorName: String,
  creatorAvatar: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  fileType: { type: String, enum: ["text", "pdf"], default: "text" },
  fileName: String,
  fileSize: String,

  isPremium: { type: Boolean, default: false },
  price: Number,
  qrCodeUrl: String,

  rating: { type: Number, default: 5 },
  ratingsCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },

  versions: [NoteVersionSchema],
  annotations: [AnnotationSchema],
  comments: [CommentSchema],

  isCollaborative: { type: Boolean, default: false },
  activeCollaborators: [{
    name: String,
    color: String,
    x: Number,
    y: Number,
  }],
});

export default mongoose.model("Note", NoteSchema);