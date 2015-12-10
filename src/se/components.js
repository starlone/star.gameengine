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
    ComponentPlatformPlayerController
*/
se.ComponentPlatformPlayerController = function (joystick, speed, jumpspeed, gravity){
    this.joystick = joystick;
    this.speed = speed;
    this.gravity = gravity;
    this.jumpspeed = jumpspeed;
    this.jumptime = 0;
    this.jumptimeend = 25;
    this.isjump = false;
    this.maxH = 200;
};

se.ComponentPlatformPlayerController.prototype.update = function(obj, deltaTime){
    this.deltaTime = deltaTime;
    var x = this.joystick.getAxis('horizontal') * this.speed * deltaTime;
    if(x){
        obj.transform.move(x, 0);
        if(x > 0)
            obj.transform.rotate.x = 1;
        else if (x < 0)
            obj.transform.rotate.x = -1;

    }
    var y = obj.transform.getXY().y;
    if(this.isjump){
        if(y > this.jumptimeend)
            obj.transform.move(0, -1 * this.jumpspeed * deltaTime);
        else
            this.isjump = false;
    } else {
        if(this.isgrounded()){
            if(this.joystick.getAxis('jump')){
                this.isjump = true;
                this.jumptimeend = y - this.maxH;
                obj.transform.move(0, -1 * this.jumpspeed * deltaTime);
            }
        } else
            obj.transform.move(0, this.gravity * deltaTime);
    }
};

se.ComponentPlatformPlayerController.prototype.isgrounded = function(){
    var obj = this.parent;
    var can = obj.transform.canMove(0, this.gravity * this.deltaTime);
    return !can;
}

se.ComponentPlatformPlayerController.prototype.setParent = function(obj){
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
se.ComponentRigidBody.prototype.update = function(obj, deltaTime){
    obj.transform.move(0, this.gravity * deltaTime);
}
se.ComponentRigidBody.prototype.setParent = function(obj){
    this.parent = obj;
}

