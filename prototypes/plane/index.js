"use strict";

var triangulate = require("delaunay-triangulate");
var Poisson = require("poisson-disk-sampling");

var p = new Poisson([200, 200], 20, 30, 10, Math.random);
var triangles = triangulate(p.fill());

console.log(triangles);