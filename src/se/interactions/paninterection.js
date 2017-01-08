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

  function start(x2, y2) {
    x = x2;
    y = y2;
    isDown = true;
  }

  function end() {
    isDown = false;
  }

  function move(ex, ey) {
    if (!isDown) {
      return;
    }
    var x2 = x;
    var y2 = y;
    x = ex;
    y = ey;
    var x3 = x2 - x;
    var y3 = y2 - y;
    self.target.transform.move(x3, y3);
  }

  element.addEventListener('mousedown', function (e) {
    start(e.offsetX, e.offsetY);
  });
  element.addEventListener('mouseup', function () {
    end();
  });
  element.addEventListener('mousemove', function (e) {
    move(e.offsetX, e.offsetY);
  });
  element.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      start(t.pageX, t.pageY);
    }
  });
  element.addEventListener('touchend', function () {
    end();
  });
  element.addEventListener('touchmove', function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      move(t.pageX, t.pageY);
    }
  });
};
