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

/*
   GradientRenderer
*/
se.GradientRenderer = function(color1, color2){
    this.color1 = color1 || '#004CB3';
    this.color2 = color2 || '#8ED6FF';
}

se.GradientRenderer.prototype.setParent = function(obj){
    this.parent = obj;
}

se.GradientRenderer.prototype.render = function(ctx, params){
    var grd = ctx.createLinearGradient(150, 300, 150, 0);
    grd.addColorStop(0, this.color1);   
    grd.addColorStop(1, this.color2);
    ctx.fillStyle = grd;
    ctx.fillRect(params.x, params.y, params.width, params.height);
}

