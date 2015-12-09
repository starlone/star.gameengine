/*
BoxRender
*/
se.BoxRenderer = function(color){
    this.color = color;
}

se.BoxRenderer.prototype.render = function(ctx){
    var obj = this.parent;
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, obj.width, obj.height);
}

se.BoxRenderer.prototype.setParent = function(obj){
    this.parent = obj;
}

