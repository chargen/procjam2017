"use strict";

var PNG = require('pngjs').PNG,
    Noise = require('noisejs').Noise,
    fs = require('fs');

var noise = new Noise(0.5);

var image = new PNG({
    width:800,
    height:600
});

var size = 1;

for (var y = 0; y < image.height; y++) {
    for (var x = 0; x < image.width; x++) {
        var idx = (image.width * y + x) << 2;

        var n1 = Math.pow((1 + noise.perlin2(x/200 * size,y/200 * size)) / 2, 2.5);
        var n2 = Math.pow((1 + noise.perlin2(x/100 * size + n1 * 0.6,y/100 * size - n1 * 0.6)) / 2, 1.5 + n1);
        var n3 = Math.pow((1 + noise.perlin2(x/50 * size - n2 * 1.5 + n1 * 0.6,y/50 * size + n2 * 1.5 - n1 * 0.6)) / 2, 1.0 + n2);
        var col = Math.pow(Math.min((
            n1 * 0.65 +
            (0.6 + 0.4 * n1) * n2 * 0.25 +
            (0.75 + 0.25 * n1) * n3 * 0.25
        ), 1), 1.5) * 0xFF | 0;

        image.data[idx] = col;
        image.data[idx + 1] = col;
        image.data[idx + 2] = col;
        image.data[idx + 3] = 0xff;
    }
}

var buffer = PNG.sync.write(image);
fs.writeFileSync('out.png', buffer);