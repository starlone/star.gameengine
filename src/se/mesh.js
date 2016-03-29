
/*
    Mesh
*/
se.Mesh = function (parent, options){
    this.parent = parent;
    options = options || {};
    this.vertices = options.vertices || [];
};

se.Mesh.prototype.setVertices = function(vertices){
    this.vertices = vertices;
};

se.Mesh.prototype.getVertices = function(){
    return this.vertices;
};

se.Mesh.prototype.getExtent = function(){
    var extent = se.Extent.createEmpty();
    extent.extendVectors(this.vertices);
    return extent;
};

