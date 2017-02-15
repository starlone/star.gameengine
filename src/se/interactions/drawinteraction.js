/*
  DrawInteraction
  */
se.DrawInteraction = function (target) {
  se.Interaction.call(this);
  this.target = target;
  var self = this;
  this.last = null;

  this.click = function () {
    if (!self.target) {
      return null;
    }
    if (self.last && self.point.equals(self.last)) {
      return;
    }
    self.last = self.point;
    self.point = self.point.clone();
    self.target.mesh.addVertice(self.point);
  };

  this.end = function () {
    if (!self.target) {
      return null;
    }
    self.target.mesh.vertices.pop();
    document.dispatchEvent(se.drawEndEvent);
    self.target = null;
  };

  this.mousemove = function (e) {
    self.move(e.offsetX, e.offsetY);
  };

  this.touchmove = function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      self.move(t.pageX, t.pageY);
    }
  };
};

se.inherit(se.Interaction, se.DrawInteraction);

se.drawStartEvent = new Event('seDrawStart');
se.drawEndEvent = new Event('seDrawEnd');

se.DrawInteraction.prototype.active = function () {
  var element = this.parent.element;
  this.point = new se.Point(0, 0);
  if (this.target) {
    this.target.mesh.addVertice(this.point);
  }
  document.dispatchEvent(se.drawStartEvent);

  element.addEventListener('click', this.click);
  element.addEventListener('dblclick', this.end);

  element.addEventListener('mousemove', this.mousemove);
  element.addEventListener('touchmove', this.touchmove);
};

se.DrawInteraction.prototype.desactive = function () {
  var element = this.parent.element;
  element.removeEventListener('click', this.click);
  element.removeEventListener('dblclick', this.end);
  element.removeEventListener('mousemove', this.mousemove);
  element.removeEventListener('touchmove', this.touchmove);
};

se.DrawInteraction.prototype.move = function (x, y) {
  if (!this.target) {
    return null;
  }
  var last = this.parent.transformPixelToCoordinate(x, y);
  this.point.change(last.x, last.y);
};

