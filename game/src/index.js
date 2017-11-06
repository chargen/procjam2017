"use strict";

console.log(1);

var GameLoop = require('migl-gameloop/src/flexible'),
    Player = require('./game/entities/player'),
    fullscreen = require('./game/fullscreen'),
    input = require('./game/input'),
    renderer = require('./game/renderer');

var pathGenerator = require('./generation/path-generator'),
    nameGenerator = require('./generation/name-generator');

function init () {
    var element = document.body;

    var debugMode = false,
        debugCmd = input.commands.debug,
        soundCmd = input.commands.sound;

    var seed = 'a';// + Math.random();

    var pathData = pathGenerator(seed);
    var name = nameGenerator(seed);
    console.log('Seed :', seed);
    console.log('Name :', name);

    var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 7500);
    camera.position.set(pathData[0][0] * 5 + 2, 2, pathData[0][1] * 5 + 2);
    camera.lookAt(new THREE.Vector3(pathData[0][0] * 5, 0, pathData[0][1] * 5));
    camera.updateProjectionMatrix();
    renderer.useCamera(camera);
    renderer.appendTo(element);

    var controls = new THREE.OrbitControls( camera, renderer.renderer.domElement );


    var positions = [];
    var normals = [];

    var size = 5;
    var roadWidth = 0.15;



    pathData.length = pathData.length - 2;

    var shape = [
        -0.5, -10,
        -0.5, 0.025,
        -0.4, 0,
        -0.3, 0,
        -0.2, 0,
        -0.1, 0,
        0, 0,
        0.1, 0,
        0.2, 0,
        0.3, 0,
        0.4, 0,
        0.5, 0.025,
        0.5, -10
    ];

    for (var k = 0; k < pathData.length; k++) {
        var nk = (k + 1) % pathData.length;

        var px = pathData[k][0] * size;
        var py = pathData[k][1] * size;
        var pz = pathData[k][2] * size;
        var nx = pathData[k][3] * roadWidth * pathData[k][6];
        var ny = pathData[k][4] * roadWidth * pathData[k][6];
        var a = pathData[k][5] * pathData[k][6];
        var npx = pathData[nk][0] * size;
        var npy = pathData[nk][1] * size;
        var npz = pathData[nk][2] * size;
        var nnx = pathData[nk][3] * roadWidth * pathData[nk][6];
        var nny = pathData[nk][4] * roadWidth * pathData[nk][6];
        var na = pathData[nk][5] * pathData[nk][6];

        for (var i = 0; i < shape.length / 2 - 1; i++) {
            var s0x = shape[i * 2];
            var s0z = shape[i * 2 + 1];
            var s1x = shape[(i + 1) * 2];
            var s1z = shape[(i + 1) * 2 + 1];
            var c0x = px + nx * s0x;
            var c0y = py + ny * s0x;
            var c0z = pz + s0z;
            var c1x = px + nx * s1x;
            var c1y = py + ny * s1x;
            var c1z = pz + s1z;
            var nc0x = npx + nnx * s0x;
            var nc0y = npy + nny * s0x;
            var nc0z = npz + s0z;
            var nc1x = npx + nnx * s1x;
            var nc1y = npy + nny * s1x;
            var nc1z = npz + s1z;

            positions.push(
                nc1x, nc1z, nc1y,
                nc0x, nc0z, nc0y,
                c1x, c1z, c1y,

                c1x, c1z, c1y,
                nc0x, nc0z, nc0y,
                c0x, c0z, c0y
            );
        }
    }

    console.log(positions.length / 3, positions.length / 9);
    var geometry = new THREE.BufferGeometry();
    //geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.computeVertexNormals();


    var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }));
    renderer.addElement(mesh);

    document.body.addEventListener('keyup', function (e) {
        if (e.which === 70) { // 'F'
            // this must be done directly in the event callback for browser security reasons
            // thus cannot be handle in the game loop or by migl-input
            fullscreen.toggleFullscreen(element);
        }
    });

    window.addEventListener('resize', function resize () {
        renderer.resize(window.innerWidth, window.innerHeight, 1, 1);
    });

    var player = new Player(input);

    var loop = new GameLoop({
        update: function (deltaTime) {
            input.update(deltaTime);
            player.update(deltaTime);
        },
        postUpdate: function (deltaTime) {

        },
        render: function (deltaTime) {
            renderer.render();
        },
        postRender: function (deltaTime) {

        }
    });

    loop.start();
}

module.exports = function main () {
    console.log('main');
    init();
};