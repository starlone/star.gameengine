/*
    Star Game Engine
*/

var se = new Object();

window.animationFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

se.windowGameMain = null;

se.updateFrame = function (){
    se.windowGameMain.update();
    animationFrame(se.updateFrame);
}


