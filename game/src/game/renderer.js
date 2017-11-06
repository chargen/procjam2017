"use strict";

var baseWidth = window.innerWidth,
    baseHeight = window.innerHeight,
    pixelRatio = 1; //(typeof window.devicePixelRatio !== 'undefined' ? window.devicePixelRatio : 1);

var renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false, stencil: true, depth: true, maxLights: 0 }),
    scene = new THREE.Scene();

renderer.setPixelRatio(pixelRatio);
renderer.setSize(baseWidth, baseHeight);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 1);

module.exports = {
    screenWidth: baseWidth,
    screenHeight: baseHeight,
    camera: null,
    scene: scene,
    renderer: renderer,
    composer: null,

    useCamera: function (camera) {
        this.camera = camera;
        this.scene.add(camera);

        //this.composer.setCamera(camera);
    },
    resize: function (width, height, widthRatio, heightRatio) {
        this.screenHeight = height;
        this.screenWidth = width;

        var widthAtRatio = (width * widthRatio)|0;
        var heightAtRatio = (height * heightRatio)|0;
        var rescaledWidth = widthAtRatio / widthRatio;
        var rescaledHeight = heightAtRatio / heightRatio;

        //console.log(width, height, widthAtRatio, heightAtRatio, rescaledWidth, rescaledHeight);

        this.renderer.setSize(widthAtRatio, heightAtRatio);
        this.renderer.domElement.style.width = rescaledWidth + 'px';
        this.renderer.domElement.style.height = rescaledHeight + 'px';

        //this.composer.setSize(width, height);
        this.camera.aspect = rescaledWidth / rescaledHeight;
        this.camera.updateProjectionMatrix();
    },
    appendTo: function (domElement) {
        domElement.appendChild(renderer.domElement);
    },
    addElement: function (object) {
        this.scene.add(object);
    },
    addElements: function (objects) {
        var scene = this.scene;

        for(var i = 0; i < objects.length; i++) {
            this.scene.add(objects[i]);
        }
    },
    removeElement: function (object) {
        this.scene.remove(object);
    },
    removeElements: function (objects) {
        var scene = this.scene;

        for(var i = 0; i < objects.length; i++) {
            this.scene.remove(objects[i]);
        }
    },
    render: function () {
        //this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        //this.composer.render();
    }
};