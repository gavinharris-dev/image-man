import express from "express";
import sharp from "sharp";
import { getFileReadStream, upload } from "../utils/storage";

const TEN_DAYS = 60 * 60 * 24 * 10;
const router = express.Router();
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

/* GET home page. */
router.get("/f/:fileName", function (req, res, next) {
  const widthParam = req.query.w || "200";
  const heightParam = req.query.h || "200";
  const qualityParam = req.query.q || "60";
  const fileName = req.params.fileName;

  //Validate
  if (typeof widthParam !== "string") {
    return res.status(400).json({ msg: "Bad Parameter: width (w)", code: 10 });
  }
  if (typeof heightParam !== "string") {
    return res.status(400).json({ msg: "Bad Parameter: height (h)", code: 11 });
  }
  if (typeof qualityParam !== "string") {
    return res
      .status(400)
      .json({ msg: "Bad Parameter: quality (q)", code: 12 });
  }

  try {
    const width: number = Number.parseInt(widthParam);
    const height: number = Number.parseInt(heightParam);
    const quality: number = Number.parseInt(qualityParam);

    const stream = getFileReadStream(fileName);

    const sharpWorker = sharp()
      .resize(width, height, {
        // position: ''
      })
      .jpeg({ quality: quality });

    res.setHeader("Cache-Control", `public, max-age=${TEN_DAYS}, immutable`);

    stream.pipe(sharpWorker).pipe(res);
  } catch (err) {
    res.status(400).json({ msg: err.message, code: 101 });
  }
});

router.post("/", async function (req, res, next) {
  // Validate
  if (!req.files) {
    return res.status(400).json({ msg: "No file uplodated", code: 1 });
  }

  if (!req.files.img) {
    return res
      .status(400)
      .json({ msg: "Upload the image the form name `img`", code: 2 });
  }

  if (Array.isArray(req.files.img)) {
    return res
      .status(400)
      .json({ msg: "I'm not supporting multiple files yet. Sorry.", code: 3 });
  }

  try {
    await upload(req.files.img, req.files.img.md5);
    res.status(201).json({ url: `${BASE_URL}/f/${req.files.img.md5}` });
  } catch (err) {
    // console.error(err, err.stack);
    res.status(500).send();
  }
});

export default router;
