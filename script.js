var originalImage = null;
var grayImage = null;
var redImage = null;
var greenImage = null;
var blueImage = null;
var invertImage = null;
var blurImage = null;
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
    blurImage = new SimpleImage(img);
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

function doBlur() {
    if (imageIsLoaded(blurImage)) {
        Blur();
    }
}

// fn for creating multidim array of zeros
function zeros(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}

function Blur() {
    var ctx = canvas_actuall_img.getContext("2d");
    var imgData = ctx.getImageData(0, 0, canvas_actuall_img.width, canvas_actuall_img.height);
    // console.log(imgData);
    // console.log(blurImage.width, blurImage.height);

    var img = zeros([4, blurImage.height, blurImage.width]);
    var px = 0, i = 0;
    for (var y = 0; y < blurImage.height; y++) {
        for (var x = 0; x < blurImage.width; x++) {
            img[i++][y][x] = imgData.data[px * 4];
            img[i++][y][x] = imgData.data[px * 4 + 1];
            img[i++][y][x] = imgData.data[px * 4 + 2];
            img[i][y][x] = imgData.data[px * 4 + 3];
            i = 0;
            px++;
        }
    }

    // console.log('img', img);
    var img1 = zeros([4, blurImage.height, blurImage.width]);
    var blurness = 6;
    for (var k = 0; k < 3; k++) {
        for (var i = 0; i < blurImage.height; i++) {
            for (var j = 0; j < blurImage.width; j++) {
                // console.log('k', k, 'i', i, 'j', j);
                var r1 = i - blurness, r2 = i + blurness, c1 = j - blurness, c2 = j + blurness;
                if (r1 < 0) r1 = 0;
                if (r2 >= blurImage.height) r2 = blurImage.height - 1;
                if (c1 < 0) c1 = 0;
                if (c2 >= blurImage.width) c2 = blurImage.width - 1;

                var sum = 0, cnt = 0;
                // console.log('r1', r1, 'r2', r2, 'c1', c1, 'c2', c2);
                for (var x = r1; x <= r2; x++) {
                    for (var y = c1; y <= c2; y++) {
                        // console.log('x =', x, 'y =', y);
                        // console.log(img[k][x][y]);
                        sum += img[k][x][y];
                        cnt++;
                    }
                }
                // console.log('sum', sum);
                var mean = sum / cnt;
                // console.log('mean', mean);
                img1[k][i][j] = mean;
            }
        }
    }
    // console.log('img1', img1);

    var index = 0;
    for (var i = 0; i < blurImage.height; i++) {
        for (var j = 0; j < blurImage.width; j++) {
            imgData.data[index++] = img1[0][i][j];
            imgData.data[index++] = img1[1][i][j];
            imgData.data[index++] = img1[2][i][j];
            imgData.data[index++] = 255;
        }
    }
    imgData.data = new Uint8ClampedArray(imgData.data);
    // console.log(imgData);
    // console.log('index', index);

    canvas_filtered_img.width = blurImage.width;
    canvas_filtered_img.height = blurImage.height;
    var ctx1 = canvas_filtered_img.getContext("2d");
    ctx1.putImageData(imgData, 0, 0);
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
