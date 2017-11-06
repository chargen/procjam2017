"use strict";

var Input = require('migl-input');

var input = new Input({
    up: {
        keys: ['<up>', 'W', 'Z', '<pad1-button13>', '<pad1-axis2-negative>'],
        group: 'axisV'
    },
    down: {
        keys: ['<down>', 'S', '<pad1-button14>', '<pad1-axis2-positive>'],
        group: 'axisV'
    },
    left: {
        keys: ['<left>', 'A', 'Q', '<pad1-button15>', '<pad1-axis1-negative>'],
        group: 'axisH'
    },
    right: {
        keys: ['<right>', 'D', '<pad1-button16>', '<pad1-axis1-positive>'],
        group: 'axisH'
    },
    strafeLeft : {
        keys: ['K', 'X', '<pad1-button5>', '<pad1-button7>'],
        group: 'strafe'
    },
    strafeRight : {
        keys: ['L', 'C', '<pad1-button6>', '<pad1-button8>'],
        group: 'strafe'
    },
    debug: {
        keys: ['G'],
        group: 'debug'
    },
    sound: {
        keys: ['M'],
        group: 'music'
    }
});

input.attach(document.body);

module.exports = input;