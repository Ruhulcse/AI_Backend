const mongoose = require("mongoose");
require("dotenv").config();

let dbUrl = process.env.MONGODB_URI;

// if (process.env.NODE_ENV === "development") {
// 	dbUrl = process.env.MONGODB_URI;
// }

if (!dbUrl) {
  _log("Mongo url not set in env file", "red");
  return new Error("Mongo url not set in env file");
}
mongoose.connect(
  dbUrl,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      console.log(`FAILED to connect using mongoose. ${error}`);
    } else {
      console.log(`Connected to DB server. ( ${process.env.NODE_ENV} )`);
    }
  }
);

module.exports = mongoose;
