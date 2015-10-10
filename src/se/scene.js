/*
    Scene
*/
se.Scene = function (backgroundcolor){
    this.camera = new se.GameObject('MainCamera',0,0,0,0);
    this.camera.parent = this;
    this.camX = 0;
    this.camY = 0;
    this.objs = [this.camera];
	this.backcolor = 'rgba(135, 206, 250,1)';
	if(backgroundcolor)
		this.backcolor = backgroundcolor;
	
	
};
se.Scene.prototype.getWidth = function(){
    return this.parent.getWidth();
};
se.Scene.prototype.getHeight = function(){
    return this.parent.getHeight();
};
se.Scene.prototype.getCamera = function(){
    return this.camera;
};
se.Scene.prototype.getObjs = function(){
    return this.objs;
};
se.Scene.prototype.add = function(obj){
    this.objs.push(obj);
    obj.parent = this;
};
se.Scene.prototype.render = function(ctx){
    this.check_move_cam(ctx);
    this.clearframe(ctx);
    this.renderBackground(ctx);
    for(var i in this.objs){
        this.objs[i].render(ctx);
    }
};
se.Scene.prototype.renderBackground = function(ctx){
	ctx.fillStyle = this.backcolor;
	ctx.fillRect(
        this.camera.getX(),
        this.camera.getY(),
        this.getWidth(), 
        this.getHeight()
    );
}
se.Scene.prototype.clearframe = function(ctx){
    ctx.clearRect(
        this.camera.getX(),
        this.camera.getY(),
        this.getWidth(), 
        this.getHeight()
    );
}
se.Scene.prototype.check_move_cam = function(ctx){
    if(this.camX != this.camera.getX() || this.camY != this.camera.getY()){
        var x = this.camX - this.camera.getX();
        var y = this.camY - this.camera.getY();
        ctx.translate(x,y);
        this.camX = this.camera.getX();
        this.camY = this.camera.getY();
    } 
}
se.Scene.prototype.resetCamera = function(){
	this.camX = 0;
	this.camY = 0;
}
