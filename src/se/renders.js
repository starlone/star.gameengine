/*
BoxRender
*/
se.BoxRenderer = function(color){
	this.color = color;
}
se.BoxRenderer.prototype.render = function(ctx){
    var obj = this.parent;
    var position = obj.transform.getXY();
    ctx.fillStyle = this.color;
    ctx.fillRect(position.x, position.y, obj.width, obj.height);
}
se.BoxRenderer.prototype.setParent = function(obj){
	this.parent = obj;
}


