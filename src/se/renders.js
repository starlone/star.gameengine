/*
BoxRender
*/
se.RectRenderer = function(color, width, height){
    this.color = color;
    this.width = width;
    this.height = height;
}

se.RectRenderer.prototype.render = function(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
}

se.RectRenderer.prototype.setParent = function(obj){
    this.parent = obj;
}

/*
CircleRender
*/
se.CircleRenderer = function(radius, fillStyle, strokeStyle, lineWidth){
    this.radius = radius;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth || 1;
}

se.CircleRenderer.prototype.render = function(ctx){
    ctx.beginPath();

    ctx.fillStyle = this.fillStyle;
    if(this.strokeStyle){
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
    }

    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fill();

    if(this.strokeStyle)
        ctx.stroke();
}

se.CircleRenderer.prototype.setParent = function(obj){
    this.parent = obj;
}

/*
ImageRender
*/

se.ImageRenderer = function(image_src, width, height){
    this.img = new Image();
    this.is_load = false;
    this.img.src = image_src;
    this.width = width;
    this.height = height;
}

se.ImageRenderer.prototype.render = function(ctx){
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
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
se.MeshRenderer = function(fillColor, strokeColor, lineWidth){
    this.color = fillColor;
    this.strokeColor = strokeColor;
    this.lineWidth = lineWidth;
}

se.MeshRenderer.prototype.setParent = function(obj){
    this.parent = obj;
}

se.MeshRenderer.prototype.render = function(ctx){
    var pos = this.parent.transform.position;
    var part = this.parent.mesh;
    var c = ctx;

    c.beginPath();
    c.moveTo(part.vertices[0].x, part.vertices[0]);

    for (var j = 1; j < part.vertices.length; j++) {
        c.lineTo(part.vertices[j].x, part.vertices[j].y);
    }

    c.lineTo(part.vertices[0].x, part.vertices[0].y);
    c.closePath();

    c.fillStyle = this.color;
    if(this.strokeStyle){
        c.lineWidth = this.lineWidth;
        c.strokeStyle = this.strokeStyle;
        c.stroke();
    }

    c.fill();
}
