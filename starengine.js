/* global window:true */
/* eslint no-undef: 'error' */

/*
    Star Game Engine
*/

var se = {};

if (typeof window !== 'undefined') {
  window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(function () {
          callback(Date.now());
        }, 1000 / 60
        );
      };
  })();

  window.cancelAnimationFrame = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame;
}

se.inherit = function (Parent, Child) {
  var obj = Object.create(Parent.prototype);
  Child.prototype = obj;
  Child.prototype.constructor = Child;
};

/* global se:true */
/* eslint no-undef: 'error' */

/*
  Collider
*/

se.RectCollider = function (options) {
  options = options || {};
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.id = null;
  this.isStatic = false;
  if (options.isStatic !== undefined) {
    this.isStatic = options.isStatic;
  }
};

se.RectCollider.createByExtent = function (extent) {
  return new se.RectCollider(
    extent.min.x, extent.min.y, extent.max.x, extent.max.y
  );
};

se.RectCollider.prototype.setParent = function (obj) {
  this.parent = obj;
  if (this.width === undefined) {
    var ext = obj.mesh.getExtent();
    this.x = ext.min.x;
    this.y = ext.min.y;
    this.width = ext.max.x;
    this.height = ext.max.y;
  }
};

se.RectCollider.prototype.getExtent = function () {
  var obj = this.parent;
  var vector = obj.transform.getRealPosition();
  return new se.Extent(
    vector.x, vector.y, vector.x + this.width, vector.y + this.height);
};

se.RectCollider.prototype.isIntersect = function (collider) {
  var extent1 = this.getExtent();
  var extent2 = collider.getExtent();
  return extent1.intersects(extent2);
};

se.RectCollider.prototype.getIntersection = function (collider) {
  if (collider instanceof Array) {
    for (var i = 0; i < collider.length; i++) {
      var c = collider[i];
      if (this._isIntersect(c)) {
        return this._getIntersection(c);
      }
    }
  } else {
    return this._getIntersection(collider);
  }
  return null;
};

se.RectCollider.prototype._getIntersection = function (collider) {
  var extent1 = this.getExtent();
  var extent2 = collider.getExtent();
  return extent1.getIntersection(extent2);
};

se.RectCollider.prototype.resolveCollision = function (other) {
  this.parent.resolveCollision(other);
};

se.RectCollider.prototype.setStatic = function (isStatic) {
  this.isStatic = isStatic;
};

se.RectCollider.prototype.clone = function () {
  return new se.RectCollider(this.x, this.y, this.width, this.height);
};


/* global se:true */
/* eslint no-undef: 'error' */

/*
  Component
*/

se.Component = function () {

};

se.Component.prototype.update = function () {

};

se.Component.prototype.resolveCollision = function () {

};

se.Component.prototype.setParent = function (obj) {
  this.parent = obj;
};


/* global se:true */
/* eslint no-undef: 'error' */

/*
  Extent
*/
se.Extent = function (minx, miny, maxx, maxy) {
  this.min = {x: minx, y: miny};
  this.max = {x: maxx, y: maxy};
};

se.Extent.createEmpty = function () {
  return new se.Extent(Infinity, Infinity, -Infinity, -Infinity);
};

se.Extent.prototype.clone = function () {
  return new se.Extent(
    this.min.x, this.min.y, this.max.x, this.max.y);
};

se.Extent.prototype.move = function (vector) {
  this.min.x = vector.x;
  this.min.y = vector.y;
  this.max.x = vector.x + this.getWidth();
  this.max.y = vector.y + this.getHeight();
  return this;
};

se.Extent.prototype.extend = function (extent2) {
  if (extent2.min.x < this.min.x) {
    this.min.x = extent2.min.x;
  }
  if (extent2.max.x > this.max.x) {
    this.max.x = extent2.max.x;
  }
  if (extent2.min.y < this.min.y) {
    this.min.y = extent2.min.y;
  }
  if (extent2.max.y > this.max.y) {
    this.max.y = extent2.max.y;
  }
  return this;
};

se.Extent.prototype.extendVector = function (vector) {
  if (vector.x < this.min.x) {
    this.min.x = vector.x;
  }
  if (vector.x > this.max.x) {
    this.max.x = vector.x;
  }
  if (vector.y < this.min.y) {
    this.min.y = vector.y;
  }
  if (vector.y > this.max.y) {
    this.max.y = vector.y;
  }
  return this;
};

se.Extent.prototype.extendVectors = function (vectors) {
  for (var i = 0; i < vectors.lenth; i++) {
    this.extendVector(vectors[i]);
  }
  return this;
};

se.Extent.prototype.intersects = function (extent) {
  return this.min.x <= extent.max.x &&
    this.max.x >= extent.min.x &&
    this.min.y <= extent.max.y &&
    this.max.y >= extent.min.y;
};

se.Extent.prototype.getIntersection = function (extent) {
  var intersection = se.Extent.createEmpty();
  if (this.intersects(extent)) {
    if (this.min.x > extent.min.x) {
      intersection.min.x = this.min.x;
    } else {
      intersection.min.x = extent.min.x;
    }
    if (this.min.y > extent.min.y) {
      intersection.min.y = this.min.y;
    } else {
      intersection.min.y = extent.min.y;
    }
    if (this.max.x < extent.max.x) {
      intersection.max.x = this.max.x;
    } else {
      intersection.max.x = extent.max.x;
    }
    if (this.max.y < extent.max.y) {
      intersection.max.y = this.max.y;
    } else {
      intersection.max.y = extent.max.y;
    }
  } else {
    return null;
  }
  return intersection;
};

se.Extent.prototype.getWidth = function () {
  return this.max.x - this.min.x;
};

se.Extent.prototype.getHeight = function () {
  return this.max.y - this.min.y;
};


/* global se:true */
/* global Matter:true */
/* eslint no-undef: 'error' */

/*
    Factory
    */
se.factory = {};

se.factory.rect = function (options) {
  var opt = options || {};
  var name = opt.name || '';
  var x = opt.x || 0;
  var y = opt.y || 0;
  var w = opt.w || 10;
  var h = opt.h || 10;
  var img = opt.image_src;
  var fillColor = opt.fillColor || '#6B4226';
  var rigidopts = opt.rigidopts || {};

  if (opt.hasRigidbody === undefined) {
    opt.hasRigidbody = true;
  }

  var vertices = [
    new se.Vector(0, 0),
    new se.Vector(w, 0),
    new se.Vector(w, h),
    new se.Vector(0, h)
  ];

  var obj = new se.GameObject(name, x, y, {vertices: vertices});

  if (opt.hasRigidbody) {
    obj.setRigidBody(new se.RigidBody(rigidopts));
  }

  // Render
  if (img) {
    obj.setRenderer(new se.ImageRenderer(img, w, h));
  } else {
    obj.setRenderer(new se.RectRenderer(fillColor, w, h));
  }
  return obj;
};

se.factory.circle = function (options) {
  var opt = options || {};
  var name = opt.name || '';
  var x = opt.x || 0;
  var y = opt.y || 0;
  var radius = opt.radius || 10;
  var rigidopts = opt.rigidopts || {};
  var maxSides = opt.maxSides || 25;

  if (opt.hasRigidbody === undefined) {
    opt.hasRigidbody = true;
  }

  var fillColor = opt.fillColor;
  var strokeColor = opt.strokeColor;
  var lineWidth = opt.lineWidth;

  var vertices = se.factory.createCircleVertices(radius, maxSides);

  var obj = new se.GameObject(name, x, y, {vertices: vertices});

  if (opt.hasRigidbody) {
    obj.setRigidBody(new se.RigidBody(rigidopts));
  }
  obj.setRenderer(new se.CircleRenderer(radius, fillColor, strokeColor, lineWidth));
  return obj;
};

se.factory.createCircleVertices = function (radius, maxSides) {
  // approximate circles with polygons until true circles implemented in SAT
  maxSides = maxSides || 25;
  var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));

  // optimisation: always use even number of sides (half the number of unique axes)
  if (sides % 2 === 1) {
    sides += 1;
  }

  var theta = 2 * Math.PI / sides;
  var path = '';
  var offset = theta * 0.5;

  for (var i = 0; i < sides; i++) {
    var angle = offset + (i * theta);
    var xx = Math.cos(angle) * radius;
    var yy = Math.sin(angle) * radius;

    path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' ';
  }
  return Matter.Vertices.fromPath(path);
};

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
  this.angle = options.angle || 0;
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

se.GameObject.prototype.clone = function () {
  var options = {
    vertices: this.mesh.vertices,
    angle: this.angle
  };
  var x = this.transform.position.x;
  var y = this.transform.position.y;
  var obj = new this.constructor(this.name, x, y, options);
  if (this.rigidbody) {
    var b = this.rigidbody.body;
    var opt = {
      isStatic: b.isStatic
    };
    obj.setRigidBody(new se.RigidBody(opt));
  }
  if (this.renderer) {
    var renderer = this.renderer.clone();
    obj.setRenderer(renderer);
  }
  return obj;
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


/* global se:true */
/* eslint no-undef: 'error' */

/*
  Interaction Pan
  */
se.InteractionPan = function (target) {
  this.target = target;
};

se.InteractionPan.prototype.init = function () {
  var self = this;
  var x = 0;
  var y = 0;
  var isDown = false;
  var element = this.parent.element;
  element.addEventListener('mousedown', function (e) {
    x = e.offsetX;
    y = e.offsetY;
    isDown = true;
  });
  element.addEventListener('mouseup', function () {
    isDown = false;
  });
  element.addEventListener('mousemove', function (e) {
    if (!isDown) {
      return;
    }
    var x2 = x;
    var y2 = y;
    x = e.offsetX;
    y = e.offsetY;
    var x3 = x2 - x;
    var y3 = y2 - y;
    self.target.transform.move(x3, y3);
  });
};

se.InteractionPan.prototype.setParent = function (obj) {
  this.parent = obj;
  this.init();
};

/* global se:true */
/* global document:true */
/* eslint no-undef: 'error' */

/*
  Joystick
  */
se.Joystick = function () {
  this.x = 0;
  this.y = 0;
  this.jump = false;
  this.keyhandler = new se.KeyboardHandler(this);
};

se.Joystick.prototype.getAxis = function (name) {
  if (name === 'horizontal') {
    return this.x;
  }
  if (name === 'vertical') {
    return this.y;
  }
  if (name === 'jump') {
    return this.jump;
  }
  return 0;
};

se.Joystick.prototype.setAxis = function (name, val) {
  if (name === 'horizontal') {
    this.x = val;
  }
  if (name === 'vertical') {
    this.y = val;
  }
  if (name === 'jump') {
    this.jump = val;
  }
};

se.Joystick.prototype.resetAxis = function () {
  this.x = 0;
  this.y = 0;
  this.jump = false;
};

/*
  KeyboardHandler
*/
se.KeyboardHandler = function (joystick) {
  var self = this;
  this.joy = joystick;
  document.addEventListener('keydown', function (e) {
    var key = parseInt(e.keyCode, 0);
    self.keydown(key);
  });
  document.addEventListener('keyup', function (e) {
    var key = parseInt(e.keyCode, 0);
    self.keyup(key);
  });
};

se.KeyboardHandler.prototype.keydown = function (key) {
  if (key === 65 || key === 37) { // Left
    this.joy.setAxis('horizontal', -1);
  } else if (key === 68 || key === 39) { // 'right'
    this.joy.setAxis('horizontal', 1);
  } else if (key === 87 || key === 38) { // Up
    this.joy.setAxis('vertical', -1);
  } else if (key === 83 || key === 40) { // 'Down'
    this.joy.setAxis('vertical', 1);
  } else if (key === 32) { // 'Space'
    this.joy.setAxis('jump', true);
  }
};

se.KeyboardHandler.prototype.keyup = function (key) {
  if (key === 65 || key === 68 || key === 37 || key === 39) {
    this.joy.setAxis('horizontal', 0);
  } else if (key === 87 || key === 83 || key === 38 || key === 40) {
    this.joy.setAxis('vertical', 0);
  } else if (key === 32) {
    this.joy.setAxis('jump', false);
  }
};

/* global se:true */
/* global Matter:true */
/* eslint no-undef: 'error' */

/*
  Mesh
*/
se.Mesh = function (vertices) {
  this.vertices = vertices || [];
  var centre = Matter.Vertices.centre(vertices);
  Matter.Vertices.translate(vertices, centre, -1);
};

se.Mesh.prototype.setVertices = function (vertices) {
  this.vertices = vertices;
};

se.Mesh.prototype.getVertices = function () {
  return this.vertices;
};

se.Mesh.prototype.getExtent = function () {
  var pos = this.parent.transform.getRealPosition();
  var extent = se.Extent.createEmpty();
  extent.extendVectors(this.vertices);
  return extent.move(pos);
};

se.Mesh.prototype.setParent = function (parent) {
  this.parent = parent;
};


/* global se:true */
/* eslint no-undef: 'error' */

/*
    Renderer
    */
se.Renderer = function () {

};

se.Renderer.prototype.render = function () {

};

se.Renderer.prototype.setParent = function (obj) {
  this.parent = obj;
};

se.Renderer.prototype.clone = function () {
  var copy = new this.constructor();
  for (var attr in this) {
    if ({}.hasOwnProperty.call(this, attr)) {
      copy[attr] = this[attr];
    }
  }
  return copy;
};

/* global se:true */
/* global Matter:true */
/* eslint no-undef: 'error' */

/*
  Rigid Body based in matter
*/
se.RigidBody = function (options) {
  this.options = options || {};
};

se.RigidBody.prototype.createBody = function () {
  var obj = this.parent;
  var pos = obj.transform.position;
  var options = this.options || {};
  var x = options.x || pos.x;
  var y = options.y || pos.y;
  var name = options.name || obj.name;

  if (options.canRotate === undefined) {
    options.canRotate = true;
  }

  delete options.x;
  delete options.y;

  var body = {
    label: name,
    position: {x: x, y: y},
    vertices: obj.mesh.getVertices(),
    angle: obj.angle
  };
  this.body = Matter.Body.create(Matter.Common.extend({}, body, options));
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

Matter.Body.update = function (body, deltaTime, timeScale, correction) {
  var Bounds = Matter.Bounds;
  var Vector = Matter.Vector;
  var Vertices = Matter.Vertices;
  var Axes = Matter.Axes;

  var deltaTimeSquared = Math.pow(deltaTime * timeScale * body.timeScale, 2);

  // from the previous step
  var frictionAir = 1 - (body.frictionAir * timeScale * body.timeScale);
  var velocityPrevX = body.position.x - body.positionPrev.x;
  var velocityPrevY = body.position.y - body.positionPrev.y;

  // update velocity with Verlet integration
  body.velocity.x = (velocityPrevX * frictionAir * correction) + ((body.force.x / body.mass) * deltaTimeSquared);
  body.velocity.y = (velocityPrevY * frictionAir * correction) + ((body.force.y / body.mass) * deltaTimeSquared);

  body.positionPrev.x = body.position.x;
  body.positionPrev.y = body.position.y;
  body.position.x += body.velocity.x;
  body.position.y += body.velocity.y;

  // Custom to no rotate
  // update angular velocity with Verlet integration
  if (body.canRotate) {
    body.angularVelocity = ((body.angle - body.anglePrev) * frictionAir * correction) + ((body.torque / body.inertia) * deltaTimeSquared);
  } else {
    body.angularVelocity = 0;
  }

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

/* global se:true */
/* global Matter:true */
/* eslint no-undef: 'error' */

/*
  Scene
*/
se.Scene = function (parent, renderer) {
  this.parent = parent;
  this.camera = new se.GameObject('MainCamera', 0, 0, 0, 0);
  this.objs = [];
  this.colliders = [];
  this.add(this.camera);
  this.collisionsActive = {};

  if (renderer) {
    this.renderer = renderer;
  } else {
    this.renderer = new se.GradientRenderer('#8ED6FF', '#004CB3');
    this.renderer.setParent(this);
  }

  // create a Matter.js engine
  this.matterengine = Matter.Engine.create();
  this.matterengine.enableSleeping = true;
};

se.Scene.prototype.getCamera = function () {
  return this.camera;
};

se.Scene.prototype.getObjs = function () {
  return this.objs;
};

se.Scene.prototype.setParent = function (parent) {
  this.parent = parent;
};

se.Scene.prototype.add = function (obj) {
  this.objs.push(obj);
  obj.setParent(this);
  if (obj.rigidbody) {
    this.addBody(obj.rigidbody.body);
  }
  this.addColliders(obj.getColliders());
};

se.Scene.prototype.remove = function (obj) {
  var cs = obj.getColliders();
  for (var i = 0; i < cs.length; i++) {
    var c = cs[i];
    var inx = this.colliders.indexOf(c);
    if (inx !== -1) {
      this.colliders.splice(inx, 1);
    }
  }
  if (obj.rigidbody) {
    this.removeBody(obj.rigidbody.body);
  }

  var j = this.objs.indexOf(obj);
  if (j !== -1) {
    this.objs.splice(j, 1);
  }
};

se.Scene.prototype.addBody = function (body) {
  var engine = this.matterengine;
  Matter.World.add(engine.world, body);
};

se.Scene.prototype.removeBody = function (body) {
  var engine = this.matterengine;
  Matter.Composite.removeBody(engine.world, body);
};

se.Scene.prototype.addColliders = function (colliders) {
  for (var i = 0; i < colliders.length; i++) {
    var col = colliders[i];
    this.addCollider(col);
  }
};

se.Scene.prototype.addCollider = function (collider) {
  this.colliders.push(collider);
  collider.id = this.colliders.length - 1;
};

se.Scene.prototype.update = function (deltaTime, correction) {
  Matter.Engine.update(this.matterengine, deltaTime, correction);
  this.checkColliders();
  for (var i = 0; i < this.objs.length; i++) {
    var obj = this.objs[i];
    obj.update(deltaTime, correction);
  }
};

se.Scene.prototype.checkColliders = function () {
  var old = this.collisionsActive;
  this.collisionsActive = {};
  var news = [];
  for (var i = 0; i < this.colliders.length - 1; i++) {
    var colA = this.colliders[i];
    for (var j = i + 1; j < this.colliders.length; j++) {
      var colB = this.colliders[j];
      if (colA.isStatic && colB.isStatic) {
        continue;
      }
      if (colA.isIntersect(colB)) {
        var id = colA.id + '-' + colB.id;
        var c = {a: colA, b: colB};
        this.collisionsActive[id] = c;
        if (old[id] === undefined) {
          news.push(c);
        }
      }
    }
  }
  for (var k = 0; k < news.length; k++) {
    var co = news[k];
    co.a.resolveCollision(co.b);
    co.b.resolveCollision(co.a);
  }
};

se.Scene.prototype.render = function (ctx) {
  for (var i = 0; i < this.objs.length; i++) {
    this.objs[i].render(ctx);
  }
};

se.Scene.prototype.clone = function (parent) {
  var scene = new se.Scene(parent, this.renderer);
  var objs = this.getObjs();
  for (var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    var newobj = obj.clone();
    scene.add(newobj);
  }
  return scene;
};


/* global se:true */
/* global window:true */
/* eslint no-undef: 'error' */

/*
  Star Engine
*/
se.StarEngine = function (elementID) {
  this.elementID = elementID;

  this.scenes = [];
  this.joystick = new se.Joystick();

  var defaults = {
    fps: 60,
    correction: 1,
    deltaSampleSize: 60,
    counterTimestamp: 0,
    frameCounter: 0,
    deltaHistory: [],
    timePrev: null,
    timeScalePrev: 1,
    frameRequestId: null,
    isFixed: false,
    enabled: true,
    timing: {
      timestamp: 0,
      timeScale: 1
    }
  };
  var runner = defaults;
  runner.delta = runner.delta || 1000 / runner.fps;
  runner.deltaMin = runner.deltaMin || 1000 / runner.fps;
  runner.deltaMax = runner.deltaMax || 1000 / (runner.fps * 0.5);
  runner.fps = 1000 / runner.delta;
  this.runner = runner;
};

se.StarEngine.prototype.getSceneCurrent = function () {
  return this.scenes[0];
};

se.StarEngine.prototype.addScene = function (scene) {
  this.scenes.push(scene);
  scene.setParent(this);
};

se.StarEngine.prototype.update = function (time) {
  var runner = this.runner;

  var timing = runner.timing;
  var correction = 1;
  var delta;

  if (runner.isFixed) {
    // fixed timestep
    delta = runner.delta;
  } else {
    // dynamic timestep based on wall clock between calls
    delta = (time - runner.timePrev) || runner.delta;
    runner.timePrev = time;

    // optimistically filter delta over a few frames, to improve stability
    runner.deltaHistory.push(delta);
    runner.deltaHistory = runner.deltaHistory.slice(-runner.deltaSampleSize);
    delta = Math.min.apply(null, runner.deltaHistory);

    // limit delta
    delta = delta < runner.deltaMin ? runner.deltaMin : delta;
    delta = delta > runner.deltaMax ? runner.deltaMax : delta;

    // correction for delta
    correction = delta / runner.delta;

    // update engine timing object
    runner.delta = delta;
  }

  // time correction for time scaling
  if (runner.timeScalePrev !== 0) {
    correction *= timing.timeScale / runner.timeScalePrev;
  }

  if (timing.timeScale === 0) {
    correction = 0;
  }

  runner.timeScalePrev = timing.timeScale;
  runner.correction = correction;

  // fps counter
  runner.frameCounter += 1;
  if (time - runner.counterTimestamp >= 1000) {
    runner.fps = runner.frameCounter * ((time - runner.counterTimestamp) / 1000);
    runner.counterTimestamp = time;
    runner.frameCounter = 0;
  }
};

se.StarEngine.prototype.run = function () {
  var runner = this.runner;
  var self = this;
  this.viewport = new se.ViewPort(this.elementID);
  (function render(time) {
    runner.frameRequestId = window.requestAnimationFrame(render);
    var scene = self.getSceneCurrent();
    if (time) {
      self.update(time);
      if (runner.enabled) {
        scene.update(runner.delta, runner.correction);
      }
    }
    if (self.viewport) {
      self.viewport.render(scene);
    }
  })();

  return runner;
};

se.StarEngine.prototype.pause = function (status) {
  if (status === undefined) {
    status = true;
  }
  this.runner.enabled = !status;
};

/* global se:true */
/* eslint no-undef: 'error' */

/*
  Vector
*/
se.Vector = function (x, y) {
  this.x = x;
  this.y = y;
};

se.Vector.prototype.equals = function (other) {
  return (this.x === other.x && this.y === other.y);
};

se.Vector.prototype.clone = function () {
  return new se.Vector(this.x, this.y);
};

se.Vector.prototype.change = function (x, y) {
  this.x = x;
  this.y = y;
};

se.Vector.prototype.getMagnitude = function () {
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

se.Vector.prototype.sub = function (other, isSelf) {
  var out;
  if (isSelf) {
    out = this;
  } else {
    out = new se.Vector(0, 0);
  }
  out.x = this.x - other.x;
  out.y = this.y - other.y;
  return out;
};

se.Vector.prototype.add = function (other, isSelf) {
  var out;
  if (isSelf) {
    out = this;
  } else {
    out = new se.Vector(0, 0);
  }
  out.x = this.x + other.x;
  out.y = this.y + other.y;
  return out;
};

/* global se:true */
/* global window:true */
/* eslint no-undef: 'error' */

/*
  View Port
*/
se.ViewPort = function (elementID) {
  var self = this;
  this.elementID = elementID;
  this.interactions = [];

  if (this.elementID) {
    this.element = window.document.getElementById(this.elementID);
  } else {
    this.element = window.document.body;
  }
  if (this.element.nodeName !== 'CANVAS') {
    var parent = this.element;
    this.element = window.document.createElement('canvas');
    parent.appendChild(this.element);
  }
  this.pivot = new se.Transform(this, 0, 0);

  if (this.element.getContext) {
    this.ctx = this.element.getContext('2d');
  }

  window.addEventListener('resize', function () {
    self.updateSize();
  });
  self.updateSize();
};

se.ViewPort.prototype.getContext = function () {
  return this.ctx;
};

se.ViewPort.prototype.getWidth = function () {
  return this.element.width;
};

se.ViewPort.prototype.getHeight = function () {
  return this.element.height;
};

se.ViewPort.prototype.setSize = function (width, height) {
  this.element.width = width;
  this.element.height = height;
};

se.ViewPort.prototype.updateSize = function () {
  this.resetPivot();
  var ele = this.element;
  var parent = ele.parentElement;
  this.setSize(parent.offsetWidth, parent.offsetHeight);
};

se.ViewPort.prototype.updatePivot = function (position) {
  // Reset draw
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);

  var x = position.x - (this.getWidth() / 2);
  var y = position.y - (this.getHeight() / 2);
  this.pivot.change(x, y);
  this.ctx.translate(-x, -y);
};

se.ViewPort.prototype.clearframe = function () {
  this.ctx.clearRect(
    this.pivot.position.x,
    this.pivot.position.y,
    this.getWidth(),
    this.getHeight()
  );
};

se.ViewPort.prototype.render = function (scene) {
  this.updatePivot(scene.getCamera().transform.position);
  this.clearframe();
  this.renderBackground(scene);
  scene.render(this.ctx);
};

se.ViewPort.prototype.resetPivot = function () {
  this.pivot.change(0, 0);
};

se.ViewPort.prototype.renderBackground = function (scene) {
  scene.renderer.render(this.ctx, {
    x: this.pivot.position.x,
    y: this.pivot.position.y,
    width: this.getWidth(),
    height: this.getHeight()
  });
};

se.ViewPort.prototype.addInteraction = function (interaction) {
  this.interactions.push(interaction);
  interaction.setParent(this);
};

/* global se:true */
/* eslint no-undef: 'error' */

/*
  ComponentFollowPlayer
*/
se.ComponentFollowObject = function (objTarget) {
  se.Component.call(this);
  this.objTarget = objTarget;
};

se.inherit(se.Component, se.ComponentFollowObject);

se.ComponentFollowObject.prototype.update = function (obj) {
  obj.transform.position.x = this.objTarget.transform.position.x;
  obj.transform.position.y = this.objTarget.transform.position.y;
};

/* global se:true */
/* eslint no-undef: 'error' */

/*
  ComponentPlatformPlayerController
*/
se.ComponentPlatformPlayerController = function (joystick, speed, jumpspeed) {
  se.Component.call(this);
  this.joystick = joystick;
  this.speed = speed || 0.5;
  this.jumpspeed = jumpspeed || -13;
};

se.inherit(se.Component, se.ComponentPlatformPlayerController);

se.ComponentPlatformPlayerController.prototype.update = function (obj, deltaTime) {
  var x = this.joystick.getAxis('horizontal') * deltaTime / 10;
  x = x || 0;
  var jump = this.joystick.getAxis('jump');
  if (x || jump) {
    var vel = obj.rigidbody.body.velocity;
    x = vel.x + (x * this.speed);
    var y = vel.y;
    if (x > 0) {
      obj.transform.rotate.x = 1;
    } else if (x < 0) {
      obj.transform.rotate.x = -1;
    }
    if (x > 16) {
      x = 16;
    }
    if (x < -16) {
      x = -16;
    }
    if (jump && vel.y < 1 && vel.y > -1) {
      y = this.jumpspeed;
    }
    obj.rigidbody.setVelocity({x: x, y: y});
  }
};


/* global se:true */
/* eslint no-undef: 'error' */

/*
  ComponentScript
*/
se.ComponentScript = function (functionUpdate, functionResolveCollision) {
  se.Component.call(this);
  this.update = functionUpdate || function () {};
  this.resolveCollision = functionResolveCollision;
};

se.inherit(se.Component, se.ComponentScript);

/* global se:true */
/* eslint no-undef: 'error' */

/*
  FreeController
*/
se.FreeController = function (joystick, speed) {
  se.Component.call(this);
  this.joystick = joystick;
  this.speed = speed || 1;
};

se.inherit(se.Component, se.FreeController);

se.FreeController.prototype.update = function () {
  var x = this.joystick.getAxis('horizontal') || 0;
  var y = this.joystick.getAxis('vertical') || 0;
  if (x) {
    x *= this.speed;
  }
  if (y) {
    y *= this.speed;
  }
  this.parent.transform.move(x, y);
};


/* global se:true */
/* eslint no-undef: 'error' */

/*
  CircleRenderer
*/
se.CircleRenderer = function (radius, fillStyle, strokeStyle, lineWidth) {
  se.Renderer.call(this);
  this.radius = radius;
  this.fillStyle = fillStyle;
  this.strokeStyle = strokeStyle;
  this.lineWidth = lineWidth || 1;
};

se.inherit(se.Renderer, se.CircleRenderer);

se.CircleRenderer.prototype.render = function (ctx) {
  ctx.beginPath();

  ctx.fillStyle = this.fillStyle;
  if (this.strokeStyle) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
  }

  ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
  ctx.fill();

  if (this.strokeStyle) {
    ctx.stroke();
  }
};

/* global se:true */
/* eslint no-undef: 'error' */

/*
  GradientRenderer
*/
se.GradientRenderer = function (color1, color2) {
  se.Renderer.call(this);
  this.color1 = color1 || '#004CB3';
  this.color2 = color2 || '#8ED6FF';
};

se.inherit(se.Renderer, se.GradientRenderer);

se.GradientRenderer.prototype.setParent = function (obj) {
  this.parent = obj;
};

se.GradientRenderer.prototype.render = function (ctx, params) {
  var grd = ctx.createLinearGradient(150, 0, 150, 300);
  grd.addColorStop(0, this.color1);
  grd.addColorStop(1, this.color2);
  ctx.fillStyle = grd;
  ctx.fillRect(params.x, params.y, params.width, params.height);
};

/* global se:true */
/* global Image:true */
/* eslint no-undef: 'error' */

/*
  ImageRenderer
*/

se.ImageRenderer = function (imageSrc, width, height) {
  se.Renderer.call(this);
  this.img = new Image();
  this.img.src = imageSrc;
  this.width = width;
  this.height = height;
};

se.inherit(se.Renderer, se.ImageRenderer);

se.ImageRenderer.prototype.render = function (ctx) {
  ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
};

/* global se:true */
/* eslint no-undef: 'error' */

/*
  MeshRenderer - Based in Matter JS
*/
se.MeshRenderer = function (fillColor, strokeColor, lineWidth) {
  se.Renderer.call(this);
  this.color = fillColor;
  this.strokeColor = strokeColor;
  this.lineWidth = lineWidth;
};

se.inherit(se.Renderer, se.MeshRenderer);

se.MeshRenderer.prototype.render = function (ctx) {
  var part = this.parent.mesh;
  var c = ctx;

  c.beginPath();
  c.moveTo(part.vertices[0].x, part.vertices[0]);

  for (var j = 1; j < part.vertices.length; j++) {
    c.lineTo(part.vertices[j].x, part.vertices[j].y);
  }

  c.lineTo(part.vertices[0].x, part.vertices[0].y);
  c.closePath();

  c.fillStyle = this.color;
  if (this.strokeStyle) {
    c.lineWidth = this.lineWidth;
    c.strokeStyle = this.strokeStyle;
    c.stroke();
  }

  c.fill();
};

/* global se:true */
/* eslint no-undef: 'error' */

/*
 RectRenderer
 */
se.RectRenderer = function (color, width, height) {
  se.Renderer.call(this);
  this.color = color;
  this.width = width;
  this.height = height;
};

se.inherit(se.Renderer, se.RectRenderer);

se.RectRenderer.prototype.render = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
};

se.RectRenderer.prototype.setParent = function (obj) {
  this.parent = obj;
};

