/*
    Star Game Engine
*/

var se = {};

if (typeof window !== 'undefined') {
    window.requestAnimationFrame =  (function(){
        return  window.requestAnimationFrame      ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){ 
                window.setTimeout(function() { callback(new Date.now());    }, 1000 / 60); 
            };
    })();

    window.cancelAnimationFrame = window.cancelAnimationFrame || 
                               window.mozCancelAnimationFrame;
}


