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
se.Mesh.prototype.addVertice = function (vertice) {
  this.vertices.push(vertice);
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

se.Mesh.prototype.json = function () {
  var vertices = [];
  for (var i = 0; i < this.vertices.length; i++) {
    vertices.push(this.vertices[i].json());
  }
  return {
    type: 'Mesh',
    vertices: vertices
  };
};

