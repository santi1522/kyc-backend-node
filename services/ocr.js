const Tesseract = require("tesseract.js");
const path = require("path");

function limpiarTexto(text) {
  return text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

function extraerCampo(texto, regex) {
  const match = texto.match(regex);
  return match ? match[1].trim() : null;
}

async function extractText(imagePath) {
  const result = await Tesseract.recognize(path.resolve(imagePath), "spa", {
    logger: m => console.log("[OCR]", m.status),
  });

  const textoBruto = limpiarTexto(result.data.text.toUpperCase());

  // Expresiones regulares
  const regexNombre = /(?:NOMBRE|APELLIDO)\s*[:\-]?\s*([A-Z\s]+)/;
  const regexDocumento = /(?:DNI|DOCUMENTO)\s*[:\-]?\s*(\d{6,10})/;
  const regexNacimiento = /(?:FECHA NACIMIENTO|NACIMIENTO)\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/;
  const regexVencimiento = /(?:VENCIMIENTO|VENCE)\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/;

  const nombre = extraerCampo(textoBruto, regexNombre);
  const documento = extraerCampo(textoBruto, regexDocumento);
  const nacimiento = extraerCampo(textoBruto, regexNacimiento);
  const vencimiento = extraerCampo(textoBruto, regexVencimiento);

  return {
    raw_text: textoBruto,
    nombre,
    documento,
    nacimiento,
    vencimiento,
    validacion: {
      nombre: !!nombre,
      documento: !!documento,
      nacimiento: !!nacimiento,
      vencimiento: !!vencimiento,
    },
  };
}

module.exports = { extractText };
