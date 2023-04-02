const router = require("express").Router();
const { uploadContent, getContents,downloadContent, uploadData } = require("../controllers/content");
const { upload } = require("../middlewares/fileUpload");

router.post("/api/content/upload", upload, uploadData);
router.post("/api/content/download", downloadContent);
router.get("/api/content", getContents);

module.exports = router;
