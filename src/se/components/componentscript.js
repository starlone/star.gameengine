/*
  ComponentScript
*/
se.ComponentScript = function (functionUpdate, functionResolveCollision) {
  se.Component.call(this);
  this.update = functionUpdate || function () {};
  this.resolveCollision = functionResolveCollision;
};

se.inherit(se.Component, se.ComponentScript);
