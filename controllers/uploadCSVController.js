import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import csv from "fast-csv";
import Contact from "../models/ContactModel.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/csv")) {
      fs.mkdirSync("public/csv");
    }

    cb(null, "public/csv");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);

    if (ext !== ".csv") {
      return cb(new Error("ONLY CSVS ARE ALLOWED!"));
    }

    cb(null, true);
  },
});

export const uploadCSVController = async (req, res, next) => {
  console.log(req.file);
  const totalRecords = [];
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  try {
    console.log(
      path.join(__dirname, "../", "/public/csv/" + req.file.filename)
    );
    fs.createReadStream(
      path.join(__dirname, "../", "/public/csv/" + req.file.filename)
    )
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => totalRecords.push(row))
      .on("end", async (rowCount) => {
        try {
          const contacts = await Contact.insertMany(totalRecords);
          res.json(contacts);
        } catch (error) {
          next(error);
        }
      });
  } catch (error) {
    next(error);
  }
};
