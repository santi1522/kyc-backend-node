const Tesseract = require("tesseract.js");
const path = require("path");

async function extractText(imagePath) {
  const result = await Tesseract.recognize(path.resolve(imagePath), "spa");
  return { raw_text: result.data.text };
}

module.exports = { extractText };
