/*
    Scene
*/
se.Scene = function (backgroundcolor){
    this.camera = new se.GameObject('MainCamera',0,0,0,0);
    this.camera.setParent(this);
    this.lastPosition = this.camera.transform.position.clone();
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
    var position = this.camera.transform.position;
    if(!this.lastPosition.equals(position)){
        var x = this.lastPosition.x - position.x;
        var y = this.lastPosition.y - position.y;
        ctx.translate(x,y);
        this.lastPosition.x = position.x;
        this.lastPosition.y = position.y;
    }
}

se.Scene.prototype.resetCamera = function(){
    this.lastPosition = new se.Position(0, 0);
}
