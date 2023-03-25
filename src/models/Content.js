const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const contentSchema = new Schema(
  {
    code: {
      type: String,
      trim: true,
    },
    file_name: {
      type: String,
      trim: true,
      required: true,
    },
    created_by: {
      type: objectID,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
