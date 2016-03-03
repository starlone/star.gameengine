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
    var x = this.joystick.getAxis('horizontal') * deltaTime / 1000 * 30;
    x = x || 0;
    var jump = this.joystick.getAxis('jump')
    if(x || jump){
        var vel = obj.rigidbody.body.velocity;
        var x = vel.x + x;
        var y = vel.y;
        if(x > 0)
            obj.transform.rotate.x = 1;
        else if (x < 0)
            obj.transform.rotate.x = -1;
        if(x > 16)
            x = 16;
        if(x < -16)
            x = -16;
        if(jump && vel.y < 1 && vel.y > -1){
            y = -13;
        }
        obj.rigidbody.setVelocity({x: x, y: y});
    }
};

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



