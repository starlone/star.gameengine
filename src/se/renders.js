/*
BoxRender
*/
se.BoxRenderer = function(color){
    this.color = color;
}

se.BoxRenderer.prototype.render = function(ctx){
    var obj = this.parent;
    ctx.fillStyle = this.color;
    ctx.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
}

se.BoxRenderer.prototype.setParent = function(obj){
    this.parent = obj;
}


/*
ImageRender
*/

se.ImageRenderer = function(image_src){
    this.img = new Image();
    this.is_load = false;
    this.img.src = image_src;
}

se.ImageRenderer.prototype.render = function(ctx){
    var obj = this.parent;
    ctx.drawImage(this.img, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
}

se.ImageRenderer.prototype.setParent = function(obj){
    this.parent = obj;
}
