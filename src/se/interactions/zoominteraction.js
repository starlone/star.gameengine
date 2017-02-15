/*
    ZoomInteraction
    */
se.ZoomInteraction = function () {
  se.Interaction.call(this);
  var self = this;

  this.wheel = function (e) {
    var viewport = self.parent;
    var y = 0.05;
    if (e.deltaY > 0) {
      y *= -1;
    }
    var newscale = viewport.scale() + y;
    viewport.scale(newscale);
  };

  this.touchstart = function (e) {
    if (e.touches.length === 2) {
      var a1 = self.parseTouchToVector(e.touches[0]);
      var a2 = self.parseTouchToVector(e.touches[1]);
      self._distance = a1.calcDistance(a2);
    }
  };

  this.touchmove = function (e) {
    if (e.touches.length === 2) {
      var viewport = self.parent;
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
  };
};

se.inherit(se.Interaction, se.ZoomInteraction);

se.ZoomInteraction.prototype.active = function () {
  var element = this.parent.element;
  element.addEventListener('wheel', this.wheel);
  element.addEventListener('touchstart', this.touchstart);
  element.addEventListener('touchmove', this.touchmove);
};

se.ZoomInteraction.prototype.desactive = function () {
  var element = this.parent.element;
  element.removeEventListener('wheel', this.wheel);
  element.removeEventListener('touchstart', this.touchstart);
  element.removeEventListener('touchmove', this.touchmove);
};
