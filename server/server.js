import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import vision from "@google-cloud/vision";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const client = new vision.ImageAnnotatorClient();

app.use(express.static(path.join(__dirname, "..")));

const rejectKeywords = ["permit", "learner", "temporary"];
const approveKeywords = [
  "driver license",
  "driver's license",
  "drivers license",
  "dl",
  "license",
];

app.post("/api/verify-license", upload.single("license"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "rejected", message: "No file uploaded." });
  }

  try {
    const [result] = await client.textDetection({
      image: { content: req.file.buffer.toString("base64") },
    });

    const text = (result.fullTextAnnotation?.text || "").toLowerCase();

    if (!text) {
      return res
        .status(400)
        .json({ status: "rejected", message: "Unable to read the document." });
    }

    const hasReject = rejectKeywords.some((word) => text.includes(word));
    const hasApprove = approveKeywords.some((word) => text.includes(word));

    if (hasReject || !hasApprove) {
      return res.status(400).json({
        status: "rejected",
        message: "Document rejected. Only driver's licenses are accepted.",
      });
    }

    return res.json({ status: "approved" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "rejected", message: "OCR service error." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`OCR server running on port ${port}`);
});
