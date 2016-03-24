
/*
    Mesh
*/
se.Mesh = function (parent, options){
    this.parent = parent;
    options = options || {};
    this.vertices = options.vertices || [];
    this._computeExtent();
};

se.Mesh.prototype.setVertices = function(vertices){
    this.vertices = vertices;
    this._computeExtent();
};

se.Mesh.prototype.getVertices = function(){
    return this.vertices;
};

se.Mesh.prototype.getExtent = function(){
    var obj = this.parent;
    return this.extent.clone().move(obj.transform.getXY());
};

se.Mesh.prototype._computeExtent = function(){
    this.extent = se.Extent.createEmpty();
    this.extent.extendVectors(this.vertices);
};
