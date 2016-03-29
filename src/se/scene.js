/*
    Scene
*/
se.Scene = function (parent, renderer){
    this.parent = parent;
    this.camera = new se.GameObject('MainCamera',0,0,0,0);
    this.pivot = new se.Transform(this, 0, 0);
    this.objs = [];
    this.colliders = [];
    this.add(this.camera);

    if(!renderer){
        this.renderer = new se.GradientRenderer('#8ED6FF','#004CB3');
        this.renderer.setParent(this);
    } else
        this.renderer = renderer;

    // create a Matter.js engine
    this.matterengine = Matter.Engine.create(this.parent.element);
    this.matterengine.enableSleeping = true;
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
    if(obj.rigidbody)
        this.addBody(obj.rigidbody.body)
    this.addColliders(obj.getColliders());
};

se.Scene.prototype.addBody = function(body){
    var engine = this.matterengine;
    Matter.World.add(engine.world, body);
};

se.Scene.prototype.removeBody = function(body){
    var engine = this.matterengine;
    Matter.Composite.removeBody(engine.world, body);
};

se.Scene.prototype.addColliders = function(colliders){
    for(var i in colliders)
        this.colliders.push(colliders[i]);
};

se.Scene.prototype.update = function(deltaTime, correction){
    Matter.Engine.update(this.matterengine, deltaTime, correction);
    this.checkColliders();
    for(var i in this.objs){
        var obj = this.objs[i];
        obj.update(deltaTime, correction);
    }
};

se.Scene.prototype.checkColliders = function(){
    var pairs = [];
    for(var i = 0; i < this.colliders.length -1; i++){
        var colA = this.colliders[i];
        for(var j = 1; j < this.colliders.length; j++){
            var colB = this.colliders[j];
            if(colA.isIntersect(colB))
                pairs.push([colA, colB]);
        }
    }
    for(var i in pairs){
        console.log(pairs[i])
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
