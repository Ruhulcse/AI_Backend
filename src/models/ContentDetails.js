const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const contentDetailsSchema = new Schema(
  {
    content: {
      type: objectID,
      ref: "Content",
    },
    topic: {
      type: String,
      trim: true,
    },
    prompt: {
      type: String,
      trim: true,
      required: true,
    },
    article: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContentDetails", contentDetailsSchema);
