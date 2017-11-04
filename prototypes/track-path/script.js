"use strict";

var seed = '' + Math.random();

document.location.search.split(/[?&]/g).map(function(option) {
    option = option.split('=');

    switch (option[0]) {
        case 'seed':
            seed = option[1];
            break;
    }
});

var rng = seedRandom(seed);
//rng = Math.random;

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    size = canvas.width / 2;


// adapted from https://gist.github.com/Joncom/e8e8d18ebe7fe55c3894
function doesLinesIntersect(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    var s1_x = p1_x - p0_x,
        s1_y = p1_y - p0_y,
        s2_x = p3_x - p2_x,
        s2_y = p3_y - p2_y,
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y),
        t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    return (s >= 0 && s <= 1 && t >= 0 && t <= 1)
}

function checkForLineIntersections (points, newPoint) {
    if (points.length < 2) return false;

    var l1x1 = points[points.length - 1][0],
        l1y1 = points[points.length - 1][1],
        l1x2 = newPoint[0],
        l1y2 = newPoint[1],
        l2x1, l2y1, l2x2, l2y2;

    //console.log('-----');
    //console.log('Tested line : ', l1x1.toFixed(3), l1y1.toFixed(3), l1x2.toFixed(3), l1y2.toFixed(3));

    for (var i = 1; i < points.length - 1; i++) {
        l2x1 = points[i-1][0];
        l2y1 = points[i-1][1];
        l2x2 = points[i][0];
        l2y2 = points[i][1];

        if (doesLinesIntersect(l1x1, l1y1, l1x2, l1y2, l2x1, l2y1, l2x2, l2y2)) {
            return true;
        }

        //console.log(l2x1.toFixed(3), l2y1.toFixed(3), l2x2.toFixed(3), l2y2.toFixed(3));
        //console.log(i, doesLinesIntersect(l1x1, l1y1, l1x2, l1y2, l2x1, l2y1, l2x2, l2y2));
    }

    return false;
}

function firstPass () {
    var points = [
            [0, 0]
        ],
        previousPoint = points[0],
        currentAngle = rng() * 6.28,
        pointsNumber = 12  + rng() * 6,
        retry = 0,
        newAngle,
        distance,
        newDistance,
        newPoint;

    for (var i = 0; i < pointsNumber; i++) {
        distance = 0.1 + Math.pow(rng(), 1.333) * 0.5;

        do {
            newAngle = (Math.pow(rng(), 0.8) * 0.5) * (rng() > 0.5 ? 1 : -1) * (0.9 + retry / 5);
        } while(Math.abs(Math.abs(newAngle) - 1) < 0.2);

        //console.log(newAngle);
        newAngle = currentAngle + newAngle * Math.PI;

        newPoint = [
            previousPoint[0] + Math.cos(newAngle) * distance,
            previousPoint[1] + Math.sin(newAngle) * distance
        ];

        if (
            ((newPoint[0] >= 1 || newPoint[1] >= 1 || newPoint[0] <= -1 || newPoint[1] <= -1) && rng() < 0.85) ||
            (checkForLineIntersections(points, newPoint) && rng() < 0.995)
        ) {
            //console.log('intersection !');
            i--;
            retry++;
        } else {
            points.push(newPoint);
            previousPoint = newPoint;
            currentAngle = newAngle;
            distance = newDistance;
            retry = 0;
        }
    }

    points.push([points[0][0], points[0][1]]);

    return points;
}

function normalizePoints(points) {
    var minX = 1,
        maxX = -1,
        minY = 1,
        maxY = -1;

    for (var i = 0; i < points.length; i++) {
        minX = Math.min(points[i][0], minX);
        minY = Math.min(points[i][1], minY);
        maxX = Math.max(points[i][0], maxX);
        maxY = Math.max(points[i][1], maxY);
    }

    //console.log(points);

    //console.log(minX, minY, maxX, maxY);

    var scale = Math.min(2 / Math.abs(minX - maxX), 2 / Math.abs(minY - maxY));

    //console.log(scale);

    var translateX = (maxX + minX) / 2;
    var translateY = (maxY + minY) / 2;

    for (i = 0; i < points.length; i++) {
        points[i][0] = scale * (points[i][0] - translateX);
        points[i][1] = scale * (points[i][1] - translateY);
    }

    return points;
}

function secondPass (points) {

    var processedPoints = [];

    //console.log(points);

    for (var i = 1; i < points.length; i++) {
        var lx1 = points[i-1][0],
            ly1 = points[i-1][1],
            lx2 = points[i][0],
            ly2 = points[i][1],
            length = Math.sqrt(Math.pow(lx1 - lx2, 2) + Math.pow(ly1 - ly2, 2)),
            ratio = Math.max(0.1, Math.min(0.4, 0.1 + (0.4 - length/4) + rng() * 0.3)),
            invRatio = 1 - ratio;

        processedPoints.push(
            [lx1 * invRatio + lx2 * ratio, ly1 * invRatio + ly2 * ratio],
            [lx1 * ratio + lx2 * invRatio, ly1 * ratio + ly2 * invRatio],
            [lx2, ly2]
        );
    }

    processedPoints.push(
        [processedPoints[0][0], processedPoints[0][1]],
        [processedPoints[1][0], processedPoints[1][1]],
        [processedPoints[2][0], processedPoints[2][1]]
    );

    processedPoints = catRomSpline(processedPoints, {
        samples: 12,
        knot: 0.33
    });

    //console.log(processedPoints);

    return processedPoints;
}

function smoothPoints (points, iteration, smoothing) {
    var selfMultiplier = 1 - smoothing,
        neighbourMultiplier = smoothing / 2;

    for (var i = 0; i < iteration; i++) {
        for (var k = 1; k < points.length - 1; k++) {
            points[k][0] = points[k][0] * selfMultiplier + points[k-1][0] * neighbourMultiplier + points[k+1][0] * neighbourMultiplier;
            points[k][1] = points[k][1] * selfMultiplier + points[k-1][1] * neighbourMultiplier + points[k+1][1] * neighbourMultiplier;
        }
    }

    return points;
}

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

var zoom = 0.9;

console.time('path generation');

var points = firstPass();
points = normalizePoints(points);
points = secondPass(points);
points = smoothPoints(points, 40, 0.4);

console.log('Track length :', getTrackLength(points));

console.timeEnd('path generation');

ctx.fillStyle = '#000000';
ctx.fillRect(0,0,size * 2, size * 2);

/**/

ctx.strokeStyle = '#FFFFFF';
ctx.lineWidth = 7.7;
ctx.lineCap="round";
ctx.lineJoin = "round";
ctx.beginPath();
ctx.moveTo(size + points[0][0] * size * zoom, size + points[0][1] * size * zoom);
for (var i = 1; i < points.length; i++) {
    ctx.lineTo(size + points[i][0] * size * zoom, size + points[i][1] * size * zoom);
}
ctx.stroke();

ctx.strokeStyle = '#000000';
ctx.lineWidth = 3.5;
ctx.beginPath();
ctx.moveTo(size + points[0][0] * size * zoom, size + points[0][1] * size * zoom);
for (var i = 1; i < points.length; i++) {
    ctx.lineTo(size + points[i][0] * size * zoom, size + points[i][1] * size * zoom);
}
ctx.stroke();

/*/

ctx.strokeStyle = '#FFFFFF';
ctx.fillStyle = '#FFFFFF';
ctx.lineWidth = 2.5;
ctx.beginPath();
ctx.moveTo(size + points[0][0] * size * zoom, size + points[0][1] * size * zoom);
for (var i = 1; i < points.length; i++) {
    ctx.lineTo(size + points[i][0] * size * zoom, size + points[i][1] * size * zoom);
    //ctx.fillRect(size + points[i][0] * size * zoom - 4, size + points[i][1] * size * zoom - 4, 8, 8);
}
ctx.stroke();

/**/


ctx.fillStyle = '#FF0000';
ctx.lineWidth = 2.;
ctx.beginPath();
ctx.arc(size + points[0][0] * size * zoom, size + points[0][1] * size * zoom, 9.5, 0, 2 * Math.PI, false);
ctx.fill();
ctx.stroke();