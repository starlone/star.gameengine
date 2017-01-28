/*
  Mesh
*/
se.Mesh = function (vertices) {
  this.vertices = vertices || [];
  var centre = Matter.Vertices.centre(vertices);
  Matter.Vertices.translate(vertices, centre, -1);
};

se.Mesh.prototype.setVertices = function (vertices) {
  this.vertices = vertices;
};

se.Mesh.prototype.getVertices = function () {
  return this.vertices;
};

se.Mesh.prototype.getExtent = function () {
  var pos = this.parent.transform.getRealPosition();
  var extent = se.Extent.createEmpty();
  extent.extendVectors(this.vertices);
  return extent.move(pos);
};

se.Mesh.prototype.setParent = function (parent) {
  this.parent = parent;
};

