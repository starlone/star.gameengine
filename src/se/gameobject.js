/*
    GameObject
*/
se.GameObject = function (name, x, y, width, height){
    this.name = name;
    this.transform = new se.Transform(x, y);
    this.width = width;
    this.height = height;
    this.components = [];
    this.colliders = [];
    this.renderer = null;
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
};
se.GameObject.prototype.update = function(){
    for(var i in this.components){
        this.components[i].update(this);
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
se.GameObject.prototype.move = function(x,y){
    this.transform.position.x = x;
    this.transform.position.y = y;
};
se.GameObject.prototype.sum = function(x,y){
    var xb = this.getX();
    var yb = this.getY();
    this.transform.position.x += x;
    this.transform.position.y += y;
    if(this.checkCollision()){
        this.transform.position.x = xb;
        this.transform.position.y = yb;        
    }
};
se.GameObject.prototype.checkCollision = function(){
    var scene = this.parent;
    var objs = scene.getObjs();    
    for(var i in objs){
        var obj = objs[i];        
        if(this != obj){
            if( this.isColliding( obj.getColliders() ) )
                return true;
        }
    }
    return false;
}
se.GameObject.prototype.isColliding = function(colliders){
	var cols1 = this.getColliders();
	var cols2 = colliders;
	for(var i in cols1){
        for(var j in cols2){
            var col1 = cols1[i];
            var col2 = cols2[j];
            if(col1.isIntersect(col2)){
                return true;
            }
        }
    }
    return false;
}


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
se.Transform = function(x , y){
	this.position = new se.Position(x, y);
}



