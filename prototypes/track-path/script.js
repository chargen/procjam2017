"use strict";

var seed;

document.location.search.split(/[?&]/g).map(function(option) {
    option = option.split('=');

    switch (option[0]) {
        case 'seed':
            seed = option[1];
            break;
    }
});

seed = seed || ('' + Math.random());

var textarea = document.getElementById('textarea'),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    size = canvas.width / 2;

function getTrackLength (points) {
    var sum = 0,
        p1,
        p2;

    for (var i = 0; i < points.length; i++) {
        p1 = points[i];
        p2 = points[(i + 1) % points.length];

        sum += Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    }

    return sum;
}

var zoom = 0.8;
var offsetY = 50;

console.time('path generation');


var points = pathGenerator(seed);

console.log('Track length :', getTrackLength(points));
//console.log('Name :', name);
console.timeEnd('path generation');

ctx.fillStyle = '#000000';
ctx.fillRect(0,0,size * 2, size * 2);


ctx.fillStyle = '#444444';
ctx.strokeStyle = '#444444';
ctx.lineWidth = 1.25;

/*
for (var i = 0; i < points.length; i++) {
    var ni = (i + 1) % points.length;
    ctx.beginPath();
    ctx.moveTo(size + points[i][0] * size * zoom, size + offsetY + (points[i][1] * size - points[i][2] * 0) * zoom);
    ctx.lineTo(size + points[i][0] * size * zoom, size + offsetY + (points[i][1] * size - points[i][2] * 300) * zoom);
    ctx.lineTo(size + points[ni][0] * size * zoom, size + offsetY + (points[ni][1] * size - points[ni][2] * 300) * zoom);
    ctx.lineTo(size + points[ni][0] * size * zoom, size + offsetY + (points[ni][1] * size - points[ni][2] * 0) * zoom);
    ctx.fill();
    ctx.stroke();
}
*/

/**/

/*
ctx.strokeStyle = '#FFFFFF';
ctx.lineWidth = 7.7;
ctx.lineCap="round";
ctx.lineJoin = "round";
ctx.beginPath();
ctx.moveTo(size + points[0][0] * size * zoom, size + offsetY + (points[0][1] * size - points[0][2] * 300) * zoom);
for (var i = 1; i < points.length; i++) {
    ctx.lineTo(size + points[i][0] * size * zoom, size + offsetY + (points[i][1] * size - points[i][2] * 300) * zoom);
}
ctx.stroke();

ctx.strokeStyle = '#000000';
ctx.lineWidth = 3.5;
ctx.beginPath();
ctx.moveTo(size + points[0][0] * size * zoom, size + offsetY + (points[0][1] * size - points[0][2] * 300) * zoom);
for (var i = 1; i < points.length; i++) {
    ctx.lineTo(size + points[i][0] * size * zoom, size + offsetY + (points[i][1] * size - points[i][2] * 300) * zoom);
}
 ctx.stroke();
*/

/*
ctx.strokeStyle = '#FFFFFF';
ctx.lineWidth = 2.25;
ctx.beginPath();
ctx.moveTo(size + points[0][0] * size * zoom, size + offsetY + (points[0][1] * size - points[0][2] * 300) * zoom);
for (var i = 1; i < points.length; i++) {
    ctx.lineTo(size + points[i][0] * size * zoom, size + offsetY + (points[i][1] * size - points[i][2] * 300) * zoom);
}
ctx.stroke();
*/

ctx.strokeStyle = '#FFFF00';
ctx.lineWidth = 1.25;
for (var i = 0; i < points.length; i++) {
    ctx.fillStyle = points[i][6] > 0 ? '#0000FF' : '#FF0000';
    ctx.fillRect(size + points[i][0] * size * zoom - 4, size + offsetY + (points[i][1] * size - points[i][2] * 300) * zoom - 4, 8, 8);

    ctx.beginPath();
    ctx.moveTo(size + points[i][0] * size * zoom, size + offsetY + (points[i][1] * size - points[i][2] * 300) * zoom);
    ctx.lineTo(size + (points[i][0] * size + points[i][3] * 100 * points[i][5]) * zoom, size + offsetY + (points[i][1] * size - points[i][2] * 300 + points[i][4] * 100 * points[i][5]) * zoom);
    ctx.stroke();

}

/*/

ctx.strokeStyle = '#FFFFFF';
ctx.fillStyle = '#FFFFFF';
ctx.lineWidth = 5.5;
ctx.beginPath();
ctx.moveTo(size + points[0][0] * size * zoom, size + offsetY + (points[0][1] * size - points[0][2] * 300) * zoom);
for (var i = 1; i < points.length; i++) {
    ctx.lineTo(size + points[i][0] * size * zoom, size + offsetY + (points[i][1] * size - points[i][2] * 300) * zoom);
    //ctx.fillRect(size + points[i][0] * size * zoom - 4, size + points[i][1] * size * zoom - 4, 8, 8);
}
ctx.stroke();


/**/


ctx.fillStyle = '#FF0000';
ctx.lineWidth = 2.;
ctx.beginPath();
ctx.arc(size + points[0][0] * size * zoom, size + offsetY + (points[0][1] * size - points[0][2] * 300) * zoom, 9.5, 0, 2 * Math.PI, false);
ctx.fill();
ctx.stroke();

textarea.value = JSON.stringify(points, null, 4);