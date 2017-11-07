"use strict";

var noisejs = require('noisejs'),
    seedRandom = require('seed-random'),
    catRomSpline = require('cat-rom-spline');

function doesLinesIntersect(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    // adapted from https://gist.github.com/Joncom/e8e8d18ebe7fe55c3894

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

function firstPass (rng) {
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
        } while(Math.abs(Math.abs(newAngle) - 1) < 0.4);

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

function secondPass (points, rng) {
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
        samples: 15,
        knot: 0.33
    });

    //console.log(processedPoints);

    return processedPoints;
}

function generateHeight (noise, x, y, size) {
    var n1 = Math.pow((1 + noise.perlin2(x/200 * size,y/200 * size)) / 2, 2.5),
        n2 = Math.pow((1 + noise.perlin2(x/100 * size + n1 * 0.6,y/100 * size - n1 * 0.6)) / 2, 1.5 + n1),
        n3 = Math.pow((1 + noise.perlin2(x/50 * size - n2 * 1.5 + n1 * 0.6,y/50 * size + n2 * 1.5 - n1 * 0.6)) / 2, 1.0 + n2);

    return Math.pow(Math.min((
        n1 * 0.65 +
        (0.6 + 0.4 * n1) * n2 * 0.25 +
        (0.75 + 0.25 * n1) * n3 * 0.25
    ), 1), 1.5);
}

function addZData (points, noise) {
    for (var i = 0; i < points.length; i++) {
        points[i].push(generateHeight(noise, points[i][0], points[i][1], 200));
    }

    return points;
}

function smoothPoints (points, iteration, smoothing, zSmoothing) {
    var selfMultiplier = 1 - smoothing,
        neighbourMultiplier = smoothing / 2,
        selfZMultiplier = 1 - zSmoothing,
        neighbourZMultiplier = zSmoothing / 2;

    for (var i = 0; i < iteration; i++) {
        for (var k = 1; k < points.length - 1; k++) {
            points[k][0] = points[k][0] * selfMultiplier + points[k-1][0] * neighbourMultiplier + points[k+1][0] * neighbourMultiplier;
            points[k][1] = points[k][1] * selfMultiplier + points[k-1][1] * neighbourMultiplier + points[k+1][1] * neighbourMultiplier;
            points[k][2] = points[k][2] * selfZMultiplier + points[k-1][2] * neighbourZMultiplier + points[k+1][2] * neighbourZMultiplier;
        }
    }

    return points;
}

function addNData (points) {
    var a, b, c, nx, ny, nl, rnl;
    var ab, abl, bc, bcl, ac, acl;

    for (var i = 0; i < points.length; i++) {
        a = points[(i - 5 + points.length) % points.length];
        b = points[i];
        c = points[(i + 5) % points.length];

        ab = [b[0] - a[0], b[1] - a[1]];
        bc = [c[0] - b[0], c[1] - b[1]];
        ac = [c[0] - a[0], c[1] - a[1]];
        abl = Math.sqrt(Math.pow(ab[0], 2) + Math.pow(ab[1], 2));
        bcl = Math.sqrt(Math.pow(bc[0], 2) + Math.pow(bc[1], 2));
        acl = Math.sqrt(Math.pow(ac[0], 2) + Math.pow(ac[1], 2));
        ab[0] /= abl;
        ab[1] /= abl;
        bc[0] /= bcl;
        bc[1] /= bcl;
        ac[0] /= acl;
        ac[1] /= acl;

        nx = (bc[0] - ab[0]) * -1;
        ny = (bc[1] - ab[1]) * -1;
        nl = Math.sqrt(Math.pow(nx, 2) + Math.pow(ny, 2));
        nx /= nl;
        ny /= nl;
        rnl = ((Math.atan2(ac[1], ac[0]) - Math.atan2(ny, nx) + Math.PI * 4) % (Math.PI * 2)) - Math.PI;

        b.push(nx, ny, Math.min(0.1, nl), rnl);
    }

    return points;
}

function smoothNData (points, iterations) {
    var a, b, c, l;

    for (var k = 0; k < iterations; k++) {
        for (var i = 0; i < points.length; i++) {
            a = points[(i - 1 + points.length) % points.length];
            b = points[i];
            c = points[(i + 1) % points.length];
            if (Math.sign(b[6]) === Math.sign(a[6]) && Math.sign(b[6]) === Math.sign(c[6])) {
                b[5] = b[5] * 0.5 + c[5] * 0.25 + a[5] * 0.25;
            } else {
                // this is to avoid weird glitch where the road of the curve change, ensure there are 2 segments with
                // a tilting at 0 to make the transition
                b[5] = 0;
            }
        }
    }

    return points;
}

function pathGenerator (seed) {
    var rng = new seedRandom(seed, { global: false, entropy: false }),
        noise = new noisejs.Noise(rng()),
        points;

    points = firstPass(rng);
    /*
    points = [
        [0,0],
        [1,1],
        [0,2],
        [-1,1]
    ];*/

    points = normalizePoints(points);
    points = secondPass(points, rng);
    points = addZData(points, noise);
    points = smoothPoints(points, 40, 0.4, 0.1);
    points = addNData(points);
    points = smoothNData(points, 80);

    return points;
}

module.exports = pathGenerator;