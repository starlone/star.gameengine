/*
 RectRenderer
 */
se.RectRenderer = function (color, width, height) {
  se.Renderer.call(this);
  this.color = color;
  this.width = width;
  this.height = height;
};

se.inherit(se.Renderer, se.RectRenderer);

se.RectRenderer.prototype.render = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
};

se.RectRenderer.prototype.setParent = function (obj) {
  this.parent = obj;
};

