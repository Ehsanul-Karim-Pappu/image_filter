var originalImage = null;
var grayImage = null;
var redImage = null;
var greenImage = null;
var blueImage = null;
var invertImage = null;
var canvas_actuall_img = document.getElementById("can_actuall_img");
var canvas_filtered_img = document.getElementById("can_filtered_img");

function load_act_Image() {
  var img = document.getElementById("finput_actuall");
  originalImage = new SimpleImage(img);
  grayImage = new SimpleImage(img);
  redImage = new SimpleImage(img);
  greenImage = new SimpleImage(img);
  blueImage = new SimpleImage(img);
  invertImage = new SimpleImage(img);
  originalImage.drawTo(canvas_actuall_img);
}

function doGray() {
  if (imageIsLoaded(grayImage)) {
    filterGray();
    grayImage.drawTo(canvas_filtered_img);
  }
}

function filterGray() {
  for (var pixel of grayImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
}

function doRed() {
  if (imageIsLoaded(redImage)) {
    filterRed();
    redImage.drawTo(canvas_filtered_img);
  }
}

function filterRed() {
  for (var pixel of redImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (avg < 128) {
      pixel.setRed(2 * avg);
      pixel.setGreen(0);
      pixel.setBlue(0);
    } else {
      pixel.setRed(255);
      pixel.setGreen(2 * avg - 255);
      pixel.setBlue(2 * avg - 255);
    }
  }
}

function doGreen() {
  if (imageIsLoaded(greenImage)) {
    filterGreen();
    greenImage.drawTo(canvas_filtered_img);
  }
}

function filterGreen() {
  for (var pixel of greenImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (avg < 128) {
      pixel.setRed(0);
      pixel.setGreen(2 * avg);
      pixel.setBlue(0);
    } else {
      pixel.setRed(2 * avg - 255);
      pixel.setGreen(255);
      pixel.setBlue(2 * avg - 255);
    }
  }
}

function doBlue() {
  if (imageIsLoaded(blueImage)) {
    filterBlue();
    blueImage.drawTo(canvas_filtered_img);
  }
}

function filterBlue() {
  for (var pixel of blueImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (avg < 128) {
      pixel.setRed(0);
      pixel.setGreen(0);
      pixel.setBlue(2 * avg);
    } else {
      pixel.setRed(2 * avg - 255);
      pixel.setGreen(2 * avg - 255);
      pixel.setBlue(255);
    }
  }
}

function doInvert() {
  if (imageIsLoaded(invertImage)) {
    filterInvert();
    invertImage.drawTo(canvas_filtered_img);
  }
}

function filterInvert() {
  for (var pixel of invertImage.values()) {
    pixel.setRed(255 - pixel.getRed());
    pixel.setGreen(255 - pixel.getGreen());
    pixel.setBlue(255 - pixel.getBlue());
  }
}

function reset() {
  if (imageIsLoaded(originalImage)) {
    // clear the canvas
    const context = canvas_filtered_img.getContext("2d");
    context.clearRect(0, 0, canvas_filtered_img.width, canvas_filtered_img.height);
    grayImage = new SimpleImage(originalImage);
    redImage = new SimpleImage(originalImage);
    greenImage = new SimpleImage(originalImage);
    blueImage = new SimpleImage(originalImage);
    invertImage = new SimpleImage(originalImage);
  }
}

function imageIsLoaded(img) {
  if (img == null || !img.complete()) {
    alert("Image not loaded");
    return false;
  } else {
    return true;
  }
}
