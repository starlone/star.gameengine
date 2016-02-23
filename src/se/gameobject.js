/*
    GameObject
*/
se.GameObject = function (name, x, y, width, height, options){
    this.name = name;
    this.transform = new se.Transform(this, x, y);
    this.width = width;
    this.height = height;
    this.components = [];
    this.colliders = [];
    this.renderer = null;
    this.parent = null;
    this.children = [];

    options = options || {};
    this.isStatic = options.isStatic != null ? options.isStatic : false;
    this.isSleeping = options.isSleeping || false;
    this.canRotate = options.canRotate != null ? options.canRotate : true;
    this.rigidbody = options.rigidbody || null;
    this.angle = 0;

};

se.GameObject.prototype.getX = function(){
    return this.transform.position.x;
};

se.GameObject.prototype.getY = function(){
    return this.transform.position.y;
};

se.GameObject.prototype.getWidth = function(){
    return this.width;
};

se.GameObject.prototype.getHeight = function(){
    return this.height;
};

se.GameObject.prototype.getColliders = function(){
    return this.colliders;
};

se.GameObject.prototype.setRenderer = function(renderer){
    renderer.setParent(this);
    this.renderer = renderer;
};

se.GameObject.prototype.update = function(deltaTime, correction){
    var rb = this.rigidbody;
    if(rb) 
        this.rigidbody.update(deltaTime, correction);
    for(var i in this.components){
        this.components[i].update(this, deltaTime);
    }
    for(var i in this.children){
        this.children[i].update(deltaTime);
    }
};

se.GameObject.prototype.render = function(ctx){
    var obj = this;
    var pos = obj.transform.position;
    var r = obj.transform.rotate;

    ctx.translate(pos.x, pos.y);
    //ctx.rotate(r.y*Math.PI/180);
    ctx.rotate(obj.angle);
    ctx.scale(r.x, 1);

    if(this.renderer) this.renderer.render(ctx);
    for(var i in this.children){
        this.children[i].render(ctx);
    }

    // Reset
    ctx.scale(r.x, 1);
    //ctx.rotate(-r.y*Math.PI/180);
    ctx.rotate(-obj.angle);
    ctx.translate(-pos.x, -pos.y);
};

se.GameObject.prototype.addComponent = function(component){
    this.components.push(component);
    component.setParent(this);
    return this;
};

se.GameObject.prototype.addCollider = function(collider){
    this.colliders.push(collider);
    collider.setParent(this);
    return this;
};

se.GameObject.prototype.setRigidBody = function(rigidbody){
    this.rigidbody = rigidbody;
    rigidbody.setParent(this);
    return this;
};

se.GameObject.prototype.setParent = function (parent){
    this.parent = parent;
};

se.GameObject.prototype.addChild = function (child){
    this.children.push(child);
    child.setParent(this);
};


/*
    Transform
*/
se.Transform = function(parent, x, y){
    this.parent = parent;
    this.position = new se.Vector(x, y);
    this.rotate = new se.Vector(1, 0);
};

se.Transform.prototype.change = function(x,y){
    this.position.change(x, y);
};

se.Transform.prototype.move = function(x,y){
    this.position.x += x;
    this.position.y += y;
    this.resolveCollision(x, y);
};


se.Transform.prototype.resolveCollision = function(x, y){
    var gameobj = this.parent;
    var scene = gameobj.parent;
    var objs = scene.getObjs();

    var cols = gameobj.getColliders();
    for(var i in cols){
        var col = cols[i];
        for(var j in objs){
            var obj = objs[j];
            if(gameobj != obj){
                var inter = col.getIntersection(obj.getColliders())
                if(inter){
                    if(x != 0)
                        if(x < 0) 
                            this.position.x += inter.getWidth() + 0.01;
                        else
                            this.position.x -= inter.getWidth() + 0.01;
                    if(y !=0)
                        if(y < 0) 
                            this.position.y += inter.getHeight() + 0.01;
                        else
                            this.position.y -= inter.getHeight() + 0.01;
                }
            }
        }
    }
}

se.Transform.prototype.canMove = function(x, y){
    var gameobj = this.parent;
    var scene = gameobj.parent;
    var objs = scene.getObjs();

    var cols = gameobj.getColliders();
    for(var i in cols){
        var col = cols[i].clone();
        col.setParent(gameobj);
        col.x += x;
        col.y += y;
        for(var j in objs){
            var obj = objs[j];
            if(gameobj != obj && col.isIntersect(obj.getColliders()))
                return false;
        }
    }
    return true;
};

se.Transform.prototype.getXY = function(){
    var x = this.position.x;
    var y = this.position.y;

    var obj = this.parent;
    var parent = obj.parent;
    if(parent instanceof se.GameObject){
        x += parent.transform.position.x;
        y += parent.transform.position.y;
    }

    return {x: x, y: y};
};


/*
   Collision
*/
se.Collision = function(objA, objB, intersection){
    this.objA = objA;
    this.objB = objB;
    this.intersection = intersection;
};


