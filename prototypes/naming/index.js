"use strict";

var nameGenerator = require('./name-generator');

var names = [];

for (var i = 0; i < 14; i++) {
    names.push(nameGenerator('' + Math.random()));
}

console.log(names.join('\n'));
console.log();