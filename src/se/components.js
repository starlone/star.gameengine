/*
    ComponentScript
*/
se.ComponentScript = function (function_update, function_resolveCollision){
    this.update = function_update || function(){};
    this.resolveCollision = function_resolveCollision;
};

se.ComponentScript.prototype.setParent = function(obj){
    this.parent = obj;
};

/*
    ComponentPlatformPlayerController
*/
se.ComponentPlatformPlayerController = function (joystick, speed, jumpspeed){
    this.joystick = joystick;
    this.speed = speed || 0.5;
    this.jumpspeed = jumpspeed || -13;
};

se.ComponentPlatformPlayerController.prototype.update = function(obj, deltaTime){
    var x = this.joystick.getAxis('horizontal') * deltaTime / 10;
    x = x || 0;
    var jump = this.joystick.getAxis('jump');
    if(x || jump){
        var vel = obj.rigidbody.body.velocity;
        x = vel.x + x * this.speed;
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
            y = this.jumpspeed;
        }
        obj.rigidbody.setVelocity({x: x, y: y});
    }
};

se.ComponentPlatformPlayerController.prototype.setParent = function(obj){
    this.parent = obj;
};


/*
    ComponentFollowPlayer
*/
se.ComponentFollowObject = function (obj_target){
    this.obj_target = obj_target;
};

se.ComponentFollowObject.prototype.update = function(obj){
    obj.transform.position.x = this.obj_target.transform.position.x;
    obj.transform.position.y = this.obj_target.transform.position.y;
};

se.ComponentFollowObject.prototype.setParent = function(obj){
    this.parent = obj;
};

/*
    FreeController
*/
se.FreeController = function(joystick, speed){
    this.joystick = joystick;
    this.speed = speed || 1;
};

se.FreeController.prototype.setParent = function(obj){
    this.parent = obj;
};

se.FreeController.prototype.update = function(obj, deltaTime, correction){
    var x = this.joystick.getAxis('horizontal') || 0 ;
    var y = this.joystick.getAxis('vertical') || 0 ;
    if (x) x *= this.speed;
    if (y) y *= this.speed;
    this.parent.transform.move(x, y);
};

