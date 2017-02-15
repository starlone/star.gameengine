/*
  EditRenderer - Based in Matter JS
  */
se.EditRenderer = function (fillColor, strokeStyle, lineWidth, pointColor) {
  se.Renderer.call(this);
  this.color = fillColor;
  this.strokeStyle = strokeStyle;
  this.lineWidth = lineWidth;
  this.pointColor = pointColor;
};

se.inherit(se.Renderer, se.EditRenderer);

se.EditRenderer.prototype.render = function (ctx) {
  var part = this.parent.mesh;
  var c = ctx;

  if (part.vertices.length) {
    this.renderMesh(c);
    this.renderPoints(c);
  }
  this.renderPosition(c);
};

se.EditRenderer.prototype.renderPosition = function (c) {
  // Draw position
  c.beginPath();
  var pos = this.parent.transform.position;
  c.fillStyle = 'red';
  c.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
  c.fill();
};

se.EditRenderer.prototype.renderMesh = function (c) {
  var part = this.parent.mesh;
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
se.EditRenderer.prototype.renderPoints = function (c) {
  var part = this.parent.mesh;
  c.fillStyle = this.pointColor;
  c.strokeStyle = 'white';
  c.lineWidth = 1;
  for (var i = 0; i < part.vertices.length; i++) {
    c.beginPath();
    c.arc(part.vertices[i].x, part.vertices[i].y, 3, 0, 2 * Math.PI);
    c.fill();
    c.stroke();
  }
};

se.EditRenderer.prototype.json = function () {
  return {
    type: 'EditRenderer',
    fillColor: this.color,
    strokeStyle: this.strokeStyle,
    lineWidth: this.lineWidth,
    pointColor: this.pointColor
  };
};
