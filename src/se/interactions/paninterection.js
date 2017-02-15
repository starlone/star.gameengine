/*
  PanInteraction
  */
se.PanInteraction = function (target) {
  se.Interaction.call(this);
  var self = this;
  this.target = target;
  this.inverse = true;

  this.mousedown = function (e) {
    self.start(e.offsetX, e.offsetY);
  };
  this.mouseup = function () {
    self.end();
  };
  this.mousemove = function (e) {
    self.move(e.offsetX, e.offsetY);
  };
  this.touchstart = function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      self.start(t.pageX, t.pageY);
    }
  };
  this.touchend = function () {
    self.end();
  };
  this.touchmove = function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      self.move(t.pageX, t.pageY);
    }
  };
};

se.inherit(se.Interaction, se.PanInteraction);

se.panEndEvent = new Event('sePanEnd');

se.PanInteraction.prototype.active = function () {
  this.isDown = false;
  this.last = null;

  var element = this.parent.element;
  element.addEventListener('mousedown', this.mousedown);
  element.addEventListener('mouseup', this.mouseup);
  element.addEventListener('mousemove', this.mousemove);
  element.addEventListener('touchstart', this.touchstart);
  element.addEventListener('touchend', this.touchend);
  element.addEventListener('touchmove', this.touchmove);
};

se.PanInteraction.prototype.desactive = function () {
  var element = this.parent.element;
  element.removeEventListener('mousedown', this.mousedown);
  element.removeEventListener('mouseup', this.mouseup);
  element.removeEventListener('mousemove', this.mousemove);
  element.removeEventListener('touchstart', this.touchstart);
  element.removeEventListener('touchend', this.touchend);
};

se.PanInteraction.prototype.start = function (x, y) {
  this.last = new se.Point(x, y);
  this.isDown = true;
};

se.PanInteraction.prototype.end = function () {
  this.isDown = false;
  document.dispatchEvent(se.panEndEvent);
};

se.PanInteraction.prototype.move = function (x, y) {
  var viewport = this.parent;
  if (!this.isDown) {
    return;
  }
  var point = new se.Point(x, y);
  var newp = point.sub(this.last);
  if (this.inverse) {
    newp.neg(true);
  }
  var scale = viewport.scale();
  newp.div({x: scale, y: scale}, true);
  this.target.transform.move(newp.x, newp.y);
  this.last = point;
};

