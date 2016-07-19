/*
    ComponentPlatformPlayerController
*/
se.ComponentPlatformPlayerController = function (joystick, speed, jumpspeed){
    se.Component.call(this);
    this.joystick = joystick;
    this.speed = speed || 0.5;
    this.jumpspeed = jumpspeed || -13;
};

se.inherit(se.Component, se.ComponentPlatformPlayerController);

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

