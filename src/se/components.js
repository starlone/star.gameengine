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
};
se.ComponentPlayerController.prototype.update = function(obj){
    var x = game.joystick.getAxis('horizontal') * this.speed;
    if(x)
        obj.transform.move(x,0);
    //var y = game.joystick.getAxis('vertical') * this.speed;
    if(game.joystick.getAxis('jump')){
        obj.transform.move(0, -1 * this.speed * 2);
    }
};
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

