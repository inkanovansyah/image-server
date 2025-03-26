import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "src/uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
export default upload;
