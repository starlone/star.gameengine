/* global se:true */
/* eslint no-undef: 'error' */

/*
  PanInteraction
  */
se.PanInteraction = function (target) {
  se.Interaction.call(this);
  this.target = target;
};

se.inherit(se.Interaction, se.PanInteraction);

se.PanInteraction.prototype.init = function () {
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
  element.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      x = t.pageX;
      y = t.pageY;
    }
  });
  element.addEventListener('touchmove', function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      var x2 = x;
      var y2 = y;
      x = t.pageX;
      y = t.pageY;
      var x3 = x2 - x;
      var y3 = y2 - y;
      self.target.transform.move(x3, y3);
    }
  });
};
