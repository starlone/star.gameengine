/*
  PanInteraction
  */
se.PanInteraction = function (target) {
  se.Interaction.call(this);
  this.target = target;
  this.inverse = true;
};

se.inherit(se.Interaction, se.PanInteraction);

se.panEndEvent = new Event('sePanEnd');

se.PanInteraction.prototype.init = function () {
  var self = this;
  var isDown = false;
  var element = this.parent.element;
  var viewport = this.parent;
  var last = null;

  function start(x, y) {
    last = new se.Point(x, y);
    isDown = true;
  }

  function end() {
    isDown = false;
    document.dispatchEvent(se.panEndEvent);
  }

  function move(x, y) {
    if (!isDown) {
      return;
    }
    var point = new se.Point(x, y);
    var newp = point.sub(last);
    if (self.inverse) {
      newp.neg(true);
    }
    var scale = viewport.scale();
    newp.div({x: scale, y: scale}, true);
    self.target.transform.move(newp.x, newp.y);
    last = point;
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
