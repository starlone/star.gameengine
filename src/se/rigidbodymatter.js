
/*
   Rigid Body based in matter
*/
se.RigidBodyMatter = function (options){
    this.options = options;
};

se.RigidBodyMatter.prototype.createBody = function (){
    var obj = this.parent;
    var pos = obj.transform.position;
    options = this.options || {};
    var x = options.x || pos.x;
    var y = options.y || pos.y;
    var w = options.width || obj.getWidth();
    var h = options.height || obj.getHeight();

    this.body = Matter.Bodies.rectangle(x, y, w, h, {isStatic: obj.isStatic, canRotate: obj.canRotate});
};

se.RigidBodyMatter.prototype.update = function (deltaTime){
    var pos = this.parent.transform.position;   
    pos.x = this.body.position.x;
    pos.y = this.body.position.y;
    this.parent.angle = this.body.angle;
};

se.RigidBodyMatter.prototype.setParent = function (parent){
    this.parent = parent;
    this.createBody();
};

se.RigidBodyMatter.prototype.setVelocity = function (x, y){
    Matter.Body.setVelocity(this.body, {x: x , y: y});
};

Matter.Body.update = function(body, deltaTime, timeScale, correction) {
    var Bounds = Matter.Bounds;
    var Vector = Matter.Vector;
    var Vertices = Matter.Vertices;
    var Axes = Matter.Axes;

    var deltaTimeSquared = Math.pow(deltaTime * timeScale * body.timeScale, 2);

    // from the previous step
    var frictionAir = 1 - body.frictionAir * timeScale * body.timeScale,
        velocityPrevX = body.position.x - body.positionPrev.x,
        velocityPrevY = body.position.y - body.positionPrev.y;

    // update velocity with Verlet integration
    body.velocity.x = (velocityPrevX * frictionAir * correction) + (body.force.x / body.mass) * deltaTimeSquared;
    body.velocity.y = (velocityPrevY * frictionAir * correction) + (body.force.y / body.mass) * deltaTimeSquared;

    body.positionPrev.x = body.position.x;
    body.positionPrev.y = body.position.y;
    body.position.x += body.velocity.x;
    body.position.y += body.velocity.y;

    // Custom to no rotate
    // update angular velocity with Verlet integration
    if(body.canRotate)
        body.angularVelocity = ((body.angle - body.anglePrev) * frictionAir * correction) + (body.torque / body.inertia) * deltaTimeSquared;
    else
        body.angularVelocity = 0;

    body.anglePrev = body.angle;
    body.angle += body.angularVelocity;

    // track speed and acceleration
    body.speed = Vector.magnitude(body.velocity);
    body.angularSpeed = Math.abs(body.angularVelocity);

    // transform the body geometry
    for (var i = 0; i < body.parts.length; i++) {
        var part = body.parts[i];

        Vertices.translate(part.vertices, body.velocity);
        
        if (i > 0) {
            part.position.x += body.velocity.x;
            part.position.y += body.velocity.y;
        }

        if (body.angularVelocity !== 0) {
            Vertices.rotate(part.vertices, body.angularVelocity, body.position);
            Axes.rotate(part.axes, body.angularVelocity);
            if (i > 0) {
                Vector.rotateAbout(part.position, body.angularVelocity, body.position, part.position);
            }
        }

        Bounds.update(part.bounds, part.vertices, body.velocity);
    }
};
