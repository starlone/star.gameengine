/*
  Rigid Body based in matter
*/
se.RigidBody = function (options) {
  this.options = options || {};
};

se.RigidBody.prototype.createBody = function () {
  var obj = this.parent;
  var options = this.options || {};
  var name = options.name || obj.name;

  if (options.canRotate === undefined) {
    options.canRotate = true;
  }

  var body = {
    label: name,
    position: {x: 0, y: 0},
    vertices: obj.mesh.getVertices(),
    angle: obj.angle,
    isStatic: obj.isStatic()
  };
  this.body = Matter.Body.create(Matter.Common.extend({}, body, options));
  this.updateRealPosition();
};

se.RigidBody.prototype.update = function () {
  var pos = this.parent.transform.position;
  pos.x = this.body.position.x;
  pos.y = this.body.position.y;
  this.parent.angle = this.body.angle;
};

se.RigidBody.prototype.setParent = function (parent) {
  this.parent = parent;
  this.createBody();
};

se.RigidBody.prototype.setVelocity = function (velocity) {
  Matter.Sleeping.set(this.body, false); // Wake up Object
  Matter.Body.setVelocity(this.body, velocity);
};

se.RigidBody.prototype.applyForce = function (position, force) {
  Matter.Body.applyForce(this.body, position, force);
};

se.RigidBody.prototype.setAngularVelocity = function (velocity) {
  Matter.Body.setAngularVelocity(this.body, velocity);
};

se.RigidBody.prototype.setPosition = function (position) {
  Matter.Body.setPosition(this.body, position);
};

se.RigidBody.prototype.addChild = function (child) {
  var parts = this.body.parts.slice(1);
  parts.push(child);
  Matter.Body.setParts(this.body, parts);
};

se.RigidBody.prototype.updateRealPosition = function () {
  var position = this.parent.transform.getRealPosition();
  Matter.Body.setPosition(this.body, position);
};

se.RigidBody.prototype.json = function () {
  return {
    isStatic: this.body.isStatic,
    canRotate: this.body.canRotate
  };
};

