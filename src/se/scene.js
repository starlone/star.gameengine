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
    Matter.Engine.run(this.matterengine);
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
    //this._applyGravity(this.objs, this.gravity);
    for(var i in this.objs){
        var obj = this.objs[i];
        obj.update(deltaTime);
        //obj.rigidbody.update(deltaTime);
    }
    //this._resolveColliders(this.objs);
    //this._clearForces(this.objs);
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

se.Scene.prototype._resolveColliders = function(objs){
    var collisions = [];
    for(var i = 0; i < objs.length; i++){
        var objA = objs[i];
        if (objA.isStatic || objA.isSleeping)
            continue;

        //for(var j = i + 1; j < objs.length; j ++){
        for(var j = 0; j < objs.length; j ++){
            if(i == j)
                continue;
            var objB = objs[j];
            var c = this._checkCollision(objA, objB);
            if(c)
                collisions.push(c);
        }   
    }
    for(var i in collisions){
        var c = collisions[i];  
        if(c.objB.isStatic || objB.isSleeping){
            var velA = c.objA.rigidbody.velocity;
            var posA = c.objA.transform.position;
            var posB = c.objB.transform.position;
            //if(velA.x > 0)
            //    posA.x -= c.intersection.getWidth() + 0.01;
            //else
            //    posA.x += c.intersection.getWidth() + 0.01;
            if(velA.y > 0)
                posA.y -= c.intersection.getHeight() + 0.01;
            else
                posA.y += c.intersection.getHeight() + 0.01;
            velA.x =0;
            velA.y =0;
        }
    }
};

se.Scene.prototype._checkCollision = function(objA, objB){
    var colsA = objA.getColliders();
    var colsB = objB.getColliders();
    for(var i in colsA){
        var col = colsA[i];
        if(col.isIntersect(colsB)){
            return new se.Collision(objA, objB, col.getIntersection(colsB));
        }
    }

};

se.Scene.prototype._clearForces = function(objs){
    for (var i in objs) {
        var rb = objs[i].rigidbody;
        rb.force.x = 0;
        rb.force.y = 0;
        rb.torque = 0;
    }
}

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
