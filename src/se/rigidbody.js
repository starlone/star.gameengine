/*
   Rigid Body
*/
se.RigidBody = function (parent, options){
    this.parent = parent;

    options = options || {};
    this.force = new se.Vector(0,0);
    this.velocity = new se.Vector(0,0);
    this.speed = 0;
    this.positionPrev = this.parent.transform.position.clone();

    this.frictionAir = 0.01;
    this.mass = options.mass || 6.4;
    this.timeScale = 1;

};

se.RigidBody.prototype.update = function(deltaTime){
    var obj = this.parent;
    var position = obj.transform.position;
    var correction = 1;
    var timeScale = 1;

    deltaTime *= 100;
    var deltaTimeSquared = Math.pow(deltaTime * timeScale * this.timeScale, 2);

    var frictionAir = 1 - this.frictionAir * deltaTime * this.timeScale,
        velocityPrevX = position.x - this.positionPrev.x,
        velocityPrevY = position.y - this.positionPrev.y;

    // update velocity with Verlet integration
    this.velocity.x = (velocityPrevX * frictionAir * correction) + (this.force.x / this.mass) * deltaTimeSquared;
    this.velocity.y = (velocityPrevY * frictionAir * correction) + (this.force.y / this.mass) * deltaTimeSquared;

    this.positionPrev.x = position.x;
    this.positionPrev.y = position.y;
    position.x += this.velocity.x;
    position.y += this.velocity.y;

    // update angular velocity with Verlet integration
    //body.angularVelocity = ((body.angle - body.anglePrev) * frictionAir * correction) + (body.torque / body.inertia) * deltaTimeSquared;
    //body.anglePrev = body.angle;
    //body.angle += body.angularVelocity;

    // track speed and acceleration
    this.speed = this.velocity.getMagnitude(); 
    //body.angularSpeed = Math.abs(body.angularVelocity);

};

se.RigidBody.prototype.setVelocity = function(x, y){
    var velocity = new se.Vector(x, y);
    var position = this.parent.transform.position;
    this.positionPrev.x = position.x - velocity.x;
    this.positionPrev.y = position.y - velocity.y;
    this.velocity.x = velocity.x;
    this.velocity.y = velocity.y;
    this.speed = this.velocity.getMagnitude(); 
};

se.RigidBody.prototype.applyForce = function(body, position, force) {
    var pos = this.parent.transform.position;
    this.force.x += force.x;
    this.force.y += force.y;
    var offset = { x: position.x - pos.position.x, y: position.y - pos.position.y };
    this.torque += offset.x * force.y - offset.y * force.x;
};

