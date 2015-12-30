/*
    Scene
*/
se.Scene = function (backgroundcolor){
    this.camera = new se.GameObject('MainCamera',0,0,0,0);
    this.camera.setParent(this);
    this.pivot = this.camera.transform.position.clone();
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

se.Scene.prototype.setParent = function(parent){
    this.parent = parent;
};

se.Scene.prototype.add = function(obj){
    this.objs.push(obj);
    obj.setParent(this);
};

se.Scene.prototype.update = function(deltaTime){
    for(var i in this.objs){
        this.objs[i].update(deltaTime);
    }
};

se.Scene.prototype.render = function(ctx){
    this.updatePivot(ctx);
    this.clearframe(ctx);
    this.renderBackground(ctx);
    for(var i in this.objs){
        this.objs[i].render(ctx);
    }
};

se.Scene.prototype.renderBackground = function(ctx){
    ctx.fillStyle = this.backcolor;
    ctx.fillRect(
        this.pivot.x,
        this.pivot.y,
        this.getWidth(),
        this.getHeight()
    );
}

se.Scene.prototype.clearframe = function(ctx){
    ctx.clearRect(
        this.pivot.x,
        this.pivot.y,
        this.getWidth(),
        this.getHeight()
    );
}

se.Scene.prototype.updatePivot = function(ctx){
    // Reset draw
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var position = this.camera.transform.position;

    var x = position.x - (this.getWidth() / 2);
    var y = position.y - (this.getHeight() / 2);
    this.pivot.x = x;
    this.pivot.y = y;
    ctx.translate(-this.pivot.x, -this.pivot.y);
}

se.Scene.prototype.resetCamera = function(){
    this.lastPosition = new se.Position(0, 0);
}
