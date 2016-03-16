
/*
    Mesh
*/
se.Mesh = function (options){
    options = options || {};
    this.vertices = options.vertices || [];
};

se.Mesh.prototype.setVertices = function(vertices){
    this.vertices = vertices;
};

se.Mesh.prototype.getVertices = function(){
    return this.vertices;
};

