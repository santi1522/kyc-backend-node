function compareFaces(dniPath, selfiePath) {
  // En producción usarías face-api.js o face-recognition
  return Promise.resolve(Math.random() * (1 - 0.7) + 0.7); // resultado simulado entre 0.7 y 1
}

module.exports = { compareFaces };
