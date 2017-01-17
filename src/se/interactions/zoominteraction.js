/* global se:true */
/* eslint no-undef: 'error' */

/*
    ZoomInteraction
    */
se.ZoomInteraction = function () {
  se.Interaction.call(this);
};

se.inherit(se.Interaction, se.ZoomInteraction);

se.WheelZoomInteraction.prototype.init = function () {
  var self = this;
  var viewport = this.parent;
  var element = viewport.element;
  element.addEventListener('wheel', function (e) {
    var y = 0.05;
    if (e.deltaY > 0) {
      y *= -1;
    }
    var newscale = viewport.scale() + y;
    viewport.scale(newscale);
  });
  element.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      var a1 = self.parseTouchToVector(e.touches[0]);
      var a2 = self.parseTouchToVector(e.touches[1]);
      self._distance = a1.calcDistance(a2);
    }
  });
  element.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2) {
      var b1 = self.parseTouchToVector(e.touches[0]);
      var b2 = self.parseTouchToVector(e.touches[1]);
      var distance = b1.calcDistance(b2);

      var difference = 0;
      if (self._distance !== undefined) {
        difference = (distance - self._distance) * 2 / 1000;
      }
      self._distance = distance;

      var newscale = viewport.scale() + difference;
      viewport.scale(newscale);
    }
  });
};
