/*
  MeshRenderer - Based in Matter JS
*/
se.MeshRenderer = function (fillColor, strokeStyle, lineWidth) {
  se.Renderer.call(this);
  this.color = fillColor;
  this.strokeStyle = strokeStyle;
  this.lineWidth = lineWidth;
};

se.inherit(se.Renderer, se.MeshRenderer);

se.MeshRenderer.prototype.render = function (ctx) {
  var part = this.parent.mesh;
  var c = ctx;

  if (!part.vertices.length) {
    return;
  }

  c.beginPath();
  c.moveTo(part.vertices[0].x, part.vertices[0]);

  for (var j = 1; j < part.vertices.length; j++) {
    c.lineTo(part.vertices[j].x, part.vertices[j].y);
  }

  c.lineTo(part.vertices[0].x, part.vertices[0].y);
  c.closePath();

  c.fillStyle = this.color;
  if (this.strokeStyle) {
    c.lineWidth = this.lineWidth;
    c.strokeStyle = this.strokeStyle;
    c.stroke();
  }

  c.fill();
};

se.MeshRenderer.prototype.json = function () {
  return {
    type: 'MeshRenderer',
    fillColor: this.color,
    strokeStyle: this.strokeStyle,
    lineWidth: this.lineWidth
  };
};
