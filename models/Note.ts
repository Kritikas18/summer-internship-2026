import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({

  title:String,
  description:String,
  content:String,

  subject:String,
  institution:String,

  tags:[String],

  creatorId:String,
  creatorName:String,
  creatorAvatar:String,

  createdAt:{
      type:Date,
      default:Date.now
  },

  fileType:String,
  fileName:String,
  fileSize:String,

  isPremium:Boolean,
  price:Number,
  qrCodeUrl:String,

  rating:Number,
  ratingsCount:Number,
  views:Number,
  downloads:Number,

  versions:Array,
  annotations:Array,
  comments:Array,

  isCollaborative:Boolean

});

export default mongoose.model("Note",NoteSchema);