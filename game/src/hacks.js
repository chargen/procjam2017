"use strict";

// use dumb incremental id instead of uuid
// see https://github.com/mrdoob/three.js/issues/12432#issue-266488629
THREE.Math.generateUUID = function () {
    var id = 0;
    return function generateUUID() {
        return (id++).toString();
    };
}();

module.exports = {};