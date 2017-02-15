/*
  View Port
*/
se.ViewPort = function (elementID) {
  var self = this;
  this.interactions = [];
  this._scale = 1.0;

  if (elementID) {
    if (typeof elementID === 'string') {
      this.element = window.document.querySelector(elementID);
    } else {
      this.element = elementID;
    }
  } else {
    this.element = window.document.body;
  }
  if (this.element.nodeName !== 'CANVAS') {
    var parent = this.element;
    this.element = window.document.createElement('canvas');
    parent.appendChild(this.element);
  }
  this.pivot = new se.Transform(this, 0, 0);

  if (this.element.getContext) {
    this.ctx = this.element.getContext('2d');
  }

  window.addEventListener('resize', function () {
    self.updateSize();
  });
  self.updateSize();
};

se.ViewPort.prototype.getContext = function () {
  return this.ctx;
};

se.ViewPort.prototype.getWidth = function () {
  return this.element.width / this._scale;
};

se.ViewPort.prototype.getHeight = function () {
  return this.element.height / this._scale;
};

se.ViewPort.prototype.setSize = function (width, height) {
  this.element.width = width;
  this.element.height = height;
};

se.ViewPort.prototype.updateSize = function () {
  this.resetPivot();
  var ele = this.element;
  var parent = ele.parentElement;
  this.setSize(parent.offsetWidth, parent.offsetHeight);
};

se.ViewPort.prototype.updatePivot = function (position) {
  // Reset draw
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.scale(this._scale, this._scale);

  var x = position.x - (this.getWidth() / 2);
  var y = position.y - (this.getHeight() / 2);
  this.pivot.change(x, y);
  this.ctx.translate(-x, -y);
};

se.ViewPort.prototype.clearframe = function () {
  this.ctx.clearRect(
    this.pivot.position.x,
    this.pivot.position.y,
    this.getWidth(),
    this.getHeight()
  );
};

se.ViewPort.prototype.render = function (scene) {
  this.updatePivot(scene.getCamera().transform.position);
  this.clearframe();
  this.renderBackground(scene);
  scene.render(this.ctx);
};

se.ViewPort.prototype.resetPivot = function () {
  this.pivot.change(0, 0);
};

se.ViewPort.prototype.renderBackground = function (scene) {
  scene.renderer.render(this.ctx, {
    x: this.pivot.position.x,
    y: this.pivot.position.y,
    width: this.getWidth(),
    height: this.getHeight()
  });
};

se.ViewPort.prototype.addInteraction = function (interaction) {
  this.interactions.push(interaction);
  interaction.setParent(this);
};

se.ViewPort.prototype.removeInteraction = function (interaction) {
  var inx = this.interactions.indexOf(interaction);
  if (inx !== -1) {
    this.interactions.splice(inx, 1);
    interaction.desactive();
  }
};

se.ViewPort.prototype.desactiveInteractions = function () {
  for (var i = 0; i < this.interactions.length; i++) {
    this.interactions[i].desactive();
  }
};

se.ViewPort.prototype.activeInteractions = function () {
  for (var i = 0; i < this.interactions.length; i++) {
    this.interactions[i].active();
  }
};

// Get and Setter to scale
se.ViewPort.prototype.scale = function (newscale) {
  if (arguments.length) {
    newscale = parseFloat(newscale, 1) || 1;
    if (newscale) {
      this._scale = newscale;
    }
  }
  return this._scale;
};

se.ViewPort.prototype.transformPixelToCoordinate = function (x, y) {
  var coor = new se.Point(x, y);
  var scale = new se.Point(this._scale, this._scale);
  coor.div(scale, true);
  return coor.add(this.pivot.position, true);
};
