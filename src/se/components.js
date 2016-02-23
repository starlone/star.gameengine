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
};

se.ComponentPlatformPlayerController.prototype.update = function(obj, deltaTime){
    this.deltaTime = deltaTime;
    var x = this.joystick.getAxis('horizontal') * this.speed * deltaTime;
    x = x || 0;
    var jump = this.joystick.getAxis('jump')
    if(x || jump){
        var y =0;
        if(x){
            if(x > 0)
                obj.transform.rotate.x = 1;
            else if (x < 0)
                obj.transform.rotate.x = -1;
        }
        if(jump)
            y = -10;
        obj.rigidbody.setVelocity(x, y);
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
se.ComponentFollowObject = function (obj_target){
    this.obj_target = obj_target;
}
se.ComponentFollowObject.prototype.update = function(obj){
    obj.transform.position.x = this.obj_target.transform.position.x;
    obj.transform.position.y = this.obj_target.transform.position.y;
}
se.ComponentFollowObject.prototype.setParent = function(obj){
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

