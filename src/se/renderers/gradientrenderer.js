/*
   GradientRenderer
*/
se.GradientRenderer = function(color1, color2){
    se.Renderer.call(this);
    this.color1 = color1 || '#004CB3';
    this.color2 = color2 || '#8ED6FF';
};

se.inherit(se.Renderer, se.GradientRenderer);

se.GradientRenderer.prototype.setParent = function(obj){
    this.parent = obj;
};

se.GradientRenderer.prototype.render = function(ctx, params){
    var grd = ctx.createLinearGradient(150, 0, 150, 300);
    grd.addColorStop(0, this.color1);
    grd.addColorStop(1, this.color2);
    ctx.fillStyle = grd;
    ctx.fillRect(params.x, params.y, params.width, params.height);
};


