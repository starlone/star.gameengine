/* global se:true */
/* eslint no-undef: 'error' */

/*
  Interaction Pan
  */
se.InteractionPan = function (target) {
  this.target = target;
};

se.InteractionPan.prototype.init = function () {
  var self = this;
  var x = 0;
  var y = 0;
  var isDown = false;
  var element = this.parent.element;
  element.addEventListener('mousedown', function (e) {
    x = e.offsetX;
    y = e.offsetY;
    isDown = true;
  });
  element.addEventListener('mouseup', function () {
    isDown = false;
  });
  element.addEventListener('mousemove', function (e) {
    if (!isDown) {
      return;
    }
    var x2 = x;
    var y2 = y;
    x = e.offsetX;
    y = e.offsetY;
    var x3 = x2 - x;
    var y3 = y2 - y;
    self.target.transform.move(x3, y3);
  });
};

se.InteractionPan.prototype.setParent = function (obj) {
  this.parent = obj;
  this.init();
};
