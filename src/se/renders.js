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
    var grd = ctx.createLinearGradient(150, 0, 150, 300);
    grd.addColorStop(0, this.color1);   
    grd.addColorStop(1, this.color2);
    ctx.fillStyle = grd;
    ctx.fillRect(params.x, params.y, params.width, params.height);
}


/*
   RigidBodyRenderer - Based in Matter JS
*/
se.RigidBodyRenderer = function(color){
    this.color = color;
}

se.RigidBodyRenderer.prototype.setParent = function(obj){
    this.parent = obj;
}

se.RigidBodyRenderer.prototype.render = function(ctx){
    var pos = this.parent.transform.position;
    var part = this.parent.rigidbody.body;
    var c = ctx;

    // part polygon
    c.beginPath();

    for (var j = 1; j < part.vertices.length; j++) {
        var x = part.vertices[j].x - pos.x;
        var y = part.vertices[j].y - pos.y;
        if (!part.vertices[j - 1].isInternal || showInternalEdges) {
            c.lineTo(x, y);
        } else {
            c.moveTo(x, y);
        }

        if (part.vertices[j].isInternal && !showInternalEdges) {
            x = part.vertices[(j + 1) % part.vertices.length].x - pos.x;
            y = part.vertices[(j + 1) % part.vertices.length].y - pos.y;
            c.moveTo(x, y);
        }
    }
    
    c.lineTo(part.vertices[0].x - pos.x, part.vertices[0].y - pos.y);
    c.closePath();

    c.fillStyle = this.color;
    c.lineWidth = part.render.lineWidth;
    c.strokeStyle = part.render.strokeStyle;
    c.fill();

    c.stroke();

}
