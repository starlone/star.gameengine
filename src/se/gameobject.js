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
    this.rigidbody = new se.RigidBody(this);

    options = options || {};
    this.isStatic = options.isStatic || false;
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

se.GameObject.prototype.update = function(deltaTime){
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
    ctx.rotate(r.y*Math.PI/180);
    ctx.scale(r.x, 1);

    if(this.renderer) this.renderer.render(ctx);
    for(var i in this.children){
        this.children[i].render(ctx);
    }

    // Reset
    ctx.scale(r.x, 1);
    ctx.rotate(-r.y*Math.PI/180);
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

se.GameObject.prototype.setParent = function (parent){
    this.parent = parent;
};

se.GameObject.prototype.addChild = function (child){
    this.children.push(child);
    child.setParent(this);
};


/*
   Rigid Body
*/
se.RigidBody = function (parent, options){
    this.parent = parent;

    options = options || {};
    this.force = new se.Vector(0,0);
	this.velocity = new se.Vector(0,0);
	this.speed = 0;
	this.positionPrev = this.parent.transform.position.clone();

	this.frictionAir = 0.01;
    this.mass = options.mass || 6.4;
	this.timeScale = 1;

};

se.RigidBody.prototype.update = function(deltaTime){
    var obj = this.parent;
	var position = obj.transform.position;
	var correction = 1;
	var timeScale = 1;

	var deltaTimeSquared = Math.pow(deltaTime * timeScale * this.timeScale, 2);

	var frictionAir = 1 - this.frictionAir * deltaTime * this.timeScale,
		velocityPrevX = position.x - this.positionPrev.x,
		velocityPrevY = position.y - this.positionPrev.y;

	// update velocity with Verlet integration
	this.velocity.x = (velocityPrevX * frictionAir * correction) + (this.force.x / this.mass) * deltaTimeSquared;
	this.velocity.y = (velocityPrevY * frictionAir * correction) + (this.force.y / this.mass) * deltaTimeSquared;

	this.positionPrev.x = position.x;
	this.positionPrev.y = position.y;
	position.x += this.velocity.x;
	position.y += this.velocity.y;

	// update angular velocity with Verlet integration
	//body.angularVelocity = ((body.angle - body.anglePrev) * frictionAir * correction) + (body.torque / body.inertia) * deltaTimeSquared;
	//body.anglePrev = body.angle;
	//body.angle += body.angularVelocity;

	// track speed and acceleration
	this.speed = this.velocity.getMagnitude(); 
	//body.angularSpeed = Math.abs(body.angularVelocity);

};

se.RigidBody.prototype.setVelocity = function(x, y){
	var velocity = new se.Vector(x, y);
	var position = this.parent.transform.position;
	this.positionPrev.x = position.x - velocity.x;
	this.positionPrev.y = position.y - velocity.y;
	this.velocity.x = velocity.x;
	this.velocity.y = velocity.y;
	this.speed = this.velocity.getMagnitude(); 
};

/*
   Vector
*/
se.Vector = function (x, y){
    this.x = x;
    this.y = y;
};

se.Vector.prototype.equals = function(other){
    return (this.x == other.x && this.y == other.y);
};

se.Vector.prototype.clone = function(){
    return new se.Vector(this.x, this.y);
};

se.Vector.prototype.change = function (x, y){
    this.x = x;
    this.y = y;
};

se.Vector.prototype.getMagnitude = function (){
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
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
