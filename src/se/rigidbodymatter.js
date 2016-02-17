
/*
   Rigid Body based in matter
*/
se.RigidBodyMatter = function (parent, options){
    this.parent = parent;
	var obj = parent;
	var pos = obj.transform.position;

	options = options || {};
	var x = options.x || pos.x;
	var y = options.y || pos.y;
	var w = options.width || obj.getWidth();
	var h = options.height || obj.getHeight();

	this.body = Matter.Bodies.rectangle(pos.x, pos.y, obj.getWidth(), obj.getHeight(), {isStatic: obj.isStatic});
};

se.RigidBodyMatter.prototype.update = function (deltaTime){
	var pos = this.parent.transform.position;	
	pos.x = this.body.position.x;
	pos.y = this.body.position.y;
	this.parent.angle = this.body.angle;
};

se.RigidBodyMatter.prototype.setParent = function (parent){
	this.parent = parent;
};

se.RigidBodyMatter.prototype.setVelocity = function (x, y){
	Matter.Body.setVelocity(this.body, {x: x , y: y});
};
