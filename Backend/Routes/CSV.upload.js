import express from "express";
import { uploadCSV } from "../Controllers/CSV.controller.js";
import upload from "../Middlewares/fileUpload.middleware.js";
const csvRouter = express.Router();

csvRouter.post("/upload",upload.single("csv"), uploadCSV);

export default csvRouter;