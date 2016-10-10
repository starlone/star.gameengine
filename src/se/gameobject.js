/* global se:true */
/* eslint no-undef: 'error' */

/*
  GameObject
*/
se.GameObject = function (name, x, y, options) {
  this.name = name;
  this.transform = new se.Transform(this, x, y);
  this.components = [];
  this.colliders = [];
  this.renderer = null;
  this.parent = null;
  this.children = [];

  options = options || {};

  var vertices = options.vertices || [];
  this.setMesh(new se.Mesh(vertices));

  this.rigidbody = options.rigidbody || null;
  this.angle = 0;
};

se.GameObject.prototype.getX = function () {
  return this.transform.position.x;
};

se.GameObject.prototype.getY = function () {
  return this.transform.position.y;
};

se.GameObject.prototype.getWidth = function () {
  return this.width;
};

se.GameObject.prototype.getHeight = function () {
  return this.height;
};

se.GameObject.prototype.getScene = function () {
  var parent = this.parent;
  while (parent !== null && parent instanceof se.Scene === false) {
    parent = parent.parent;
  }
  return parent;
};

se.GameObject.prototype.getColliders = function () {
  return this.colliders;
};

se.GameObject.prototype.setRenderer = function (renderer) {
  renderer.setParent(this);
  this.renderer = renderer;
};

se.GameObject.prototype.update = function (deltaTime, correction) {
  var rb = this.rigidbody;
  if (rb) {
    this.rigidbody.update(deltaTime, correction);
  }
  for (var i = 0; i < this.components.length; i++) {
    this.components[i].update(this, deltaTime, correction);
  }
  for (var j = 0; j < this.children.length; j++) {
    this.children[j].update(deltaTime, correction);
  }
};

se.GameObject.prototype.resolveCollision = function (other) {
  for (var i = 0; i < this.components.length; i++) {
    var c = this.components[i];
    if (c.resolveCollision) {
      c.resolveCollision(other);
    }
  }
};

se.GameObject.prototype.render = function (ctx) {
  var obj = this;
  var pos = obj.transform.position;
  var r = obj.transform.rotate;

  ctx.translate(pos.x, pos.y);
  // ctx.rotate(r.y*Math.PI/180);
  ctx.rotate(obj.angle);
  ctx.scale(r.x, 1);

  if (this.renderer) {
    this.renderer.render(ctx);
  }
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].render(ctx);
  }

  // Reset
  ctx.scale(r.x, 1);
  // ctx.rotate(-r.y*Math.PI/180);
  ctx.rotate(-obj.angle);
  ctx.translate(-pos.x, -pos.y);
};

se.GameObject.prototype.addComponent = function (component) {
  this.components.push(component);
  component.setParent(this);
  return this;
};

se.GameObject.prototype.addCollider = function (collider) {
  this.colliders.push(collider);
  collider.setParent(this);
  return this;
};

se.GameObject.prototype.setRigidBody = function (rigidbody) {
  this.rigidbody = rigidbody;
  rigidbody.setParent(this);
  return this;
};

se.GameObject.prototype.setParent = function (parent) {
  this.parent = parent;
};

se.GameObject.prototype.addChild = function (child) {
  this.children.push(child);
  child.setParent(this);
};

se.GameObject.prototype.removeChild = function (child) {
  this.children.remove(child);
};

se.GameObject.prototype.destroy = function () {
  if (this.parent instanceof se.GameObject) {
    this.parent.removeChild(this);
  }
  this.getScene().remove(this);
};

se.GameObject.prototype.setMesh = function (mesh) {
  this.mesh = mesh;
  mesh.setParent(this);
};

/*
  Transform
*/
se.Transform = function (parent, x, y) {
  this.parent = parent;
  this.position = new se.Vector(x, y);
  this.rotate = new se.Vector(1, 0);
};

se.Transform.prototype.change = function (x, y) {
  var rb = this.parent.rigidbody;
  if (rb) {
    rb.setPosition({x: x, y: y});
  } else {
    this.position.change(x, y);
  }
};

se.Transform.prototype.move = function (x, y) {
  this.position.x += x;
  this.position.y += y;
};

se.Transform.prototype.getRealPosition = function () {
  var x = this.position.x;
  var y = this.position.y;

  var obj = this.parent;
  var parent = obj.parent;
  if (parent instanceof se.GameObject) {
    x += parent.transform.position.x;
    y += parent.transform.position.y;
  }

  return {x: x, y: y};
};

