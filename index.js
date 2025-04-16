const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const { extractText } = require("./services/ocr");
const { compareFaces } = require("./services/faceMatch");
const { checkLiveness } = require("./services/liveness");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/kyc", upload.fields([
  { name: "dni" },
  { name: "selfie" },
  { name: "video" } // opcional
]), async (req, res) => {
  try {
    if (!req.files?.dni || !req.files?.selfie) {
      return res.status(400).json({ error: "Falta DNI o selfie" });
    }

    const dniPath = req.files.dni[0].path;
    const selfiePath = req.files.selfie[0].path;
    const videoPath = req.files?.video?.[0]?.path;

    const ocrData = await extractText(dniPath);
    const faceMatch = await compareFaces(dniPath, selfiePath);
    const liveness = videoPath ? await checkLiveness(videoPath) : true;

    // Eliminar archivos temporales
    fs.unlinkSync(dniPath);
    fs.unlinkSync(selfiePath);
    if (videoPath) fs.unlinkSync(videoPath);

    res.json({
      ocrData,
      faceMatch,
      liveness,
      status: faceMatch > 0.8 && liveness ? "approved" : "manual_review"
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Error en verificación KYC" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ API KYC escuchando en puerto ${PORT}`));
