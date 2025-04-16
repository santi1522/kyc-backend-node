const express = require("express");
const multer = require("multer");
const cors = require("cors");

const { extractText } = require("./services/ocr");
const { compareFaces } = require("./services/faceMatch");
const { checkLiveness } = require("./services/liveness");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/kyc", upload.fields([
  { name: "dni" },
  { name: "selfie" },
  { name: "video" }
]), async (req, res) => {
  try {
    const dniPath = req.files.dni[0].path;
    const selfiePath = req.files.selfie[0].path;
    const videoPath = req.files?.video?.[0]?.path;

    const ocrData = await extractText(dniPath);
    const match = await compareFaces(dniPath, selfiePath);
    const liveness = videoPath ? await checkLiveness(videoPath) : true;

    res.json({
      ocrData,
      faceMatch: match,
      liveness,
      status: match > 0.8 && liveness ? "approved" : "manual_review"
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error en el proceso KYC" });
  }
});

app.listen(process.env.PORT || 3001, () => console.log("✅ API KYC Node escuchando"));
