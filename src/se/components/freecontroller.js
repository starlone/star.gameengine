/*
  FreeController
*/
se.FreeController = function (joystick, speed) {
  se.Component.call(this);
  this.joystick = joystick;
  this.speed = speed || 1;
};

se.inherit(se.Component, se.FreeController);

se.FreeController.prototype.update = function () {
  var x = this.joystick.getAxis('horizontal') || 0;
  var y = this.joystick.getAxis('vertical') || 0;
  if (x) {
    x *= this.speed;
  }
  if (y) {
    y *= this.speed;
  }
  this.parent.transform.move(x, y);
};

