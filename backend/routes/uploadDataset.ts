import expres from "express";
import * as uploadDatasetController from "../controller/uploadDataset.controller";
import multer from "multer";
// import { upload } from "../main";
const upload = multer({ dest: "uploads/" });

export const router = expres.Router();

router.post("/upload", upload.single("file"), uploadDatasetController.upload);
router.get("/heatmap/:zone_id", uploadDatasetController.getZonData)