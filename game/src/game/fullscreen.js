"use strict";

module.exports = {
    toggleFullscreen: function (element) {
        element.requestFullscreen = element.requestFullscreen || element.msRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
        document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;

        if ((document.fullscreenElement || document.webkitFullscreenElement) === element) {
            document.exitFullscreen();
        } else {
            element.requestFullscreen();
        }
    }
};