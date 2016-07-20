/*
ImageRenderer
*/

se.ImageRenderer = function(image_src, width, height){
    se.Renderer.call(this);
    this.img = new Image();
    this.is_load = false;
    this.img.src = image_src;
    this.width = width;
    this.height = height;
};

se.inherit(se.Renderer, se.ImageRenderer);

se.ImageRenderer.prototype.render = function(ctx){
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
};


