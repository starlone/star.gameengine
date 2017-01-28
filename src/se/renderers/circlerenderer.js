/*
  CircleRenderer
*/
se.CircleRenderer = function (radius, fillStyle, strokeStyle, lineWidth) {
  se.Renderer.call(this);
  this.radius = radius;
  this.fillStyle = fillStyle;
  this.strokeStyle = strokeStyle;
  this.lineWidth = lineWidth || 1;
};

se.inherit(se.Renderer, se.CircleRenderer);

se.CircleRenderer.prototype.render = function (ctx) {
  ctx.beginPath();

  ctx.fillStyle = this.fillStyle;
  if (this.strokeStyle) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
  }

  ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
  ctx.fill();

  if (this.strokeStyle) {
    ctx.stroke();
  }
};
