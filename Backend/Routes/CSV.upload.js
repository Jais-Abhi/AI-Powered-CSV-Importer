import express from "express";
import { uploadCSV } from "../Controllers/CSV.controller.js";

const csvRouter = express.Router();

csvRouter.post("/upload", uploadCSV);

export default csvRouter;