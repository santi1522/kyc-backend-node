const fs = require("fs");
const path = require("path");
const faceapi = require("@vladmandic/face-api");
const canvas = require("canvas");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("models");
}

async function compareFaces(imgPath1, imgPath2) {
  await loadModels();

  const img1 = await canvas.loadImage(path.resolve(imgPath1));
  const img2 = await canvas.loadImage(path.resolve(imgPath2));

  const face1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor();
  const face2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor();

  if (!face1 || !face2) return 0;

  const distance = faceapi.euclideanDistance(face1.descriptor, face2.descriptor);
  const similarity = 1 - distance; // cuanto más alto, mejor

  return parseFloat(similarity.toFixed(2));
}

module.exports = { compareFaces };
