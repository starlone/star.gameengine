/*
    ComponentScript
*/
se.ComponentScript = function (function_update){
    this.update = function_update;
};
se.ComponentScript.prototype.setParent = function(obj){
	this.parent = obj;
}

/*
    ComponentPlayerController
*/
se.ComponentPlayerController = function (game,speed,gravity){
    this.window = game;
    this.speed = speed;
	this.gravity = gravity;
	this.jumpspeed = this.speed * 1.5;
	this.jumptime = 0;
	this.jumptimeend = 25;
	this.isjump = false;
};

se.ComponentPlayerController.prototype.update = function(obj){
    var x = game.joystick.getAxis('horizontal') * this.speed;
    if(x)
        obj.transform.move(x, 0);
	if(this.isjump){
		if(this.jumptime < this.jumptimeend){
			obj.transform.move(0, -1 * this.jumpspeed);
			this.jumptime += 1;
		} else {
			obj.transform.move(0, this.gravity);
			this.jumptime = 0;
			this.isjump = false;
		}
	} else {
		if(this.isgrounded()){
			if(game.joystick.getAxis('jump')){
				obj.transform.move(0, -1 * this.jumpspeed);
				this.isjump = true;
			}
		} else
			obj.transform.move(0, this.gravity);
	}
};

se.ComponentPlayerController.prototype.isgrounded = function(){
	var obj = this.parent;
	var can = obj.transform.canMove(0, this.gravity);
	return !can;
}

se.ComponentPlayerController.prototype.setParent = function(obj){
	this.parent = obj;
}


/*
    ComponentFollowPlayer
*/
se.ComponentFollowPlayer = function (obj_player){
    this.obj_player = obj_player;
}
se.ComponentFollowPlayer.prototype.update = function(obj){
	var scene = this.parent.parent;
	
    var posx = scene.getWidth() / 2 - this.obj_player.getWidth() / 2;
    posx = this.obj_player.getX() + (this.obj_player.getWidth() / 2) - posx;
    var posy = scene.getHeight() / 2 - this.obj_player.getHeight() / 2;
    posy = this.obj_player.getY() + (this.obj_player.getHeight() / 2) - posy;

    obj.transform.change(posx, posy);
}
se.ComponentFollowPlayer.prototype.setParent = function(obj){
	this.parent = obj;
}


/*
    ComponentRigidBody
*/
se.ComponentRigidBody = function (gravity){
    this.gravity = gravity;
}
se.ComponentRigidBody.prototype.update = function(obj){
    obj.transform.move(0, this.gravity);
}
se.ComponentRigidBody.prototype.setParent = function(obj){
	this.parent = obj;
}

