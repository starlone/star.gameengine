/*
    ComponentScript
*/

se.ComponentScript = function (function_update, function_resolveCollision){
    se.Component.call(this);
    this.update = function_update || function(){};
    this.resolveCollision = function_resolveCollision;
};

se.inherit(se.Component, se.ComponentScript);
