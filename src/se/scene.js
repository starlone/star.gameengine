/*
    Scene
*/
se.Scene = function (backgroundcolor){
    this.camera = new se.GameObject('MainCamera',0,0,0,0);
    this.camera.setParent(this);
    this.pivot = new se.Transform(this, 0, 0);
    this.objs = [this.camera];
    this.backcolor = backgroundcolor || 'rgba(135, 206, 250,1)';
    this.gravity = {
        x: 0,
        y: 1,
        scale: 0.001
    }
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
    this._applyGravity(this.objs, this.gravity);
    for(var i in this.objs){
        var obj = this.objs[i];
        obj.update(deltaTime);
        obj.rigidbody.update(deltaTime);
    }
};

se.Scene.prototype._applyGravity = function(objs, gravity){
    var gravityScale = typeof gravity.scale !== 'undefined' ? gravity.scale : 0.001;

    if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
        return;
    }
    
    for (var i in objs) {
        var obj = objs[i];

        if (obj.isStatic || obj.isSleeping)
            continue;

        var rb = obj.rigidbody;

        // apply gravity
        rb.force.y += rb.mass * gravity.y * gravityScale;
        rb.force.x += rb.mass * gravity.x * gravityScale;
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
        this.pivot.position.x,
        this.pivot.position.y,
        this.getWidth(),
        this.getHeight()
    );
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
