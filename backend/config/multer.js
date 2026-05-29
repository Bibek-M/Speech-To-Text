const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});


const ALLOWED_TYPES = /jpeg|jpg|png|pdf/;

const fileFilter = (req, file, cb) => {
  const extName = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimeType = ALLOWED_TYPES.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  }
  // Pass a custom error to the global handler
  cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;
