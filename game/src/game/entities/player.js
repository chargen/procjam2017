"use strict";

var Player = function Player (input) {
    this.upCmd = input.commands.up;
    this.downCmd = input.commands.down;
    this.leftCmd = input.commands.left;
    this.rightCmd = input.commands.right;
    this.strafeLeftCmd = input.commands.strafeLeft;
    this.strafeRightCmd = input.commands.strafeRight;

    this.createMesh();
};

Player.prototype.createMesh = function () {
    // TODO
};

Player.prototype.setPosition = function (x, y, z) {
    // TODO
};

Player.prototype.update = function (deltaTime) {
    // TODO

    if (this.leftCmd.active) {
        console.log('left');
    } else if (this.rightCmd.active) {
        console.log('right');
    }

    if (this.downCmd.active) {
        console.log('down');
    } else if (this.upCmd.active) {
        console.log('up');
    }

    if (this.strafeLeftCmd.active) {
        console.log('strafeleft');
    } else if (this.strafeRightCmd.active) {
        console.log('straferight');
    }
};

module.exports = Player;