async function checkLiveness(videoPath) {
  // Más adelante podés usar opencv4nodejs para parpadeo, rotación, etc.
  console.log("[LIVENESS] Validación simulada");
  return true;
}

module.exports = { checkLiveness };
