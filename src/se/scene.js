/*
    Scene
*/
se.Scene = function (parent, renderer){
    this.parent = parent;
    this.camera = new se.GameObject('MainCamera',0,0,0,0);
    this.camera.setParent(this);
    this.pivot = new se.Transform(this, 0, 0);
    this.objs = [this.camera];
    this.gravity = {
        x: 0,
        y: 1,
        //scale: 0.001
        scale: 0.003
    }

    if(!renderer){
        this.renderer = new se.GradientRenderer('#8ED6FF','#004CB3');
        this.renderer.setParent(this);
    } else
        this.renderer = renderer;

    // Matter
    // create a Matter.js engine
    this.matterengine = Matter.Engine.create(this.parent.element);
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

se.Scene.prototype.update = function(deltaTime, correction){
    Matter.Engine.update(this.matterengine, deltaTime, correction);
    for(var i in this.objs){
        var obj = this.objs[i];
        obj.update(deltaTime, correction);
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
    this.renderer.render(ctx, {
        x: this.pivot.position.x,
        y: this.pivot.position.y,
        width: this.getWidth(),
        height: this.getHeight()
    })
};

se.Scene.prototype.clearframe = function(ctx){
    ctx.clearRect(
        this.pivot.position.x,
        this.pivot.position.y,
        this.getWidth(),
        this.getHeight()
    );
};

se.Scene.prototype.updatePivot = function(ctx){
    // Reset draw
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var position = this.camera.transform.position;

    var x = position.x - (this.getWidth() / 2);
    var y = position.y - (this.getHeight() / 2);
    this.pivot.change(x, y);
    ctx.translate(-x, -y);
};

se.Scene.prototype.resetCamera = function(){
    this.pivot.change(0, 0);
};
