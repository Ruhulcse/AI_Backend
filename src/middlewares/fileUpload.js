const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../../public/uploads");
  },
  filename: function (req, file, cb) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    cb(
      null,
      yyyy +
        "-" +
        mm +
        "-" +
        dd +
        "-" +
        Date.now() +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const fileFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(xlsx|csv)$/)) {
    req.fileValidationError = "Only files types are allowed!";
    return cb(new Error("Only files types are allowed!"), false);
  }
  cb(null, true);
};

module.exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fieldNameSize: 100,
    fileSize: 50120, // 5 Mb
  },
}).single("file");
