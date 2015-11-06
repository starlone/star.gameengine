/*
    GameObject
*/
se.GameObject = function (name, x, y, width, height){
    this.name = name;
    this.transform = new se.Transform(this, x, y);
    this.width = width;
    this.height = height;
    this.components = [];
    this.colliders = [];
    this.renderer = null;
    this.parent = null;
    this.children = [];
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

se.GameObject.prototype.render = function(ctx){
    this.update();
    if(this.renderer) this.renderer.render(ctx);
    for(var i in this.children){
        this.children[i].render(ctx);
    }
};

se.GameObject.prototype.update = function(){
    for(var i in this.components){
        this.components[i].update(this);
    }
    for(var i in this.children){
        this.children[i].update();
    }
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

se.GameObject.prototype.setParent = function(parent){
    this.parent = parent;
};

se.GameObject.prototype.addChild = function(child){
    this.children.push(child);
    child.setParent(this);
};


/*
    Position
*/
se.Position = function(x, y){
	this.x = x;
	this.y = y;
}


/*
    Transform
*/
se.Transform = function(parent, x, y){
	this.parent = parent;
	this.position = new se.Position(x, y);
}

se.Transform.prototype.change = function(x,y){
	this.position.x = x;
	this.position.y = y;
}

se.Transform.prototype.move = function(x,y){
	if(this.canMove(x, y)){
		this.position.x += x;
		this.position.y += y;
	}
};

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
			if(col.isIntersect(obj.getColliders()))
				return false;
		}
	}
	return true;
}

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
}
