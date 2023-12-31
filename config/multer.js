const multer = require("multer");
const path = require("path");
//image upload
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
         cb(null, path.join("./public/files/"));
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/:/g, '_');
        const filename = timestamp + '_' + file.originalname;
        cb(null, filename);
      }
      
});
// checking file type
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.', 400), false);
    }
};
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1044 * 1044 * 6
    },
    fileFilter: fileFilter
});