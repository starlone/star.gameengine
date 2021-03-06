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
    this.width = ext.getWidth();
    this.height = ext.getHeight();
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
  this.min.x += vector.x;
  this.min.y += vector.y;
  this.max.x += vector.x;
  this.max.y += vector.y;
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
  for (var i = 0; i < vectors.length; i++) {
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

se.Extent.prototype.containsXY = function (x, y) {
  return this.min.x <= x && x <= this.max.x && this.min.y <= y && y <= this.max.y;
};

se.Extent.prototype.getCenter = function () {
  return new se.Point(
    (this.min.x + this.max.x) / 2,
    (this.min.y + this.max.y) / 2
  );
};

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

  var isStatic = false;
  if (options.isStatic !== null && options.isStatic !== undefined) {
    isStatic = options.isStatic;
  }

  if (opt.hasRigidbody === undefined) {
    opt.hasRigidbody = true;
  }

  var vertices = [
    new se.Point(-w / 2, -h / 2),
    new se.Point(w / 2, -h / 2),
    new se.Point(w / 2, h / 2),
    new se.Point(-w / 2, h / 2)
  ];

  var obj = new se.GameObject(name, x, y, {vertices: vertices, isStatic: isStatic});

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

  var isStatic = false;
  if (options.isStatic !== null && options.isStatic !== undefined) {
    isStatic = options._isStatic;
  }

  if (opt.hasRigidbody === undefined) {
    opt.hasRigidbody = true;
  }

  var fillColor = opt.fillColor;
  var strokeColor = opt.strokeColor;
  var lineWidth = opt.lineWidth;

  var vertices = se.factory.createCircleVertices(radius, maxSides);
  vertices = se.load.points(vertices);

  var obj = new se.GameObject(name, x, y, {vertices: vertices, isStatic: isStatic});

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
  this._id = null;

  options = options || {};

  var vertices = options.vertices || [];
  this.setMesh(new se.Mesh(vertices));

  this.rigidbody = options.rigidbody || null;
  this.angle = options.angle || 0;

  this._isStatic = false;
  if (options.isStatic !== null && options.isStatic !== undefined) {
    this._isStatic = options.isStatic;
  }
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

se.GameObject.prototype.id = function (newid) {
  if (arguments.length) {
    this._id = newid;
  }
  return this._id;
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

se.GameObject.prototype.getRenderer = function () {
  return this.renderer;
};

se.GameObject.prototype.getChildren = function () {
  return this.children;
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

se.GameObject.prototype.getParent = function () {
  return this.parent;
};

se.GameObject.prototype.add = function (child) {
  if (child instanceof se.GameObject) {
    this.addChild(child);
  }
};

se.GameObject.prototype.addChild = function (child) {
  child.destroy();
  this.children.push(child);
  this.initChild(child);
};

se.GameObject.prototype.addAtIndex = function (child, index) {
  child.destroy();
  var last = this.children.splice(index);
  this.children.push(child);
  for (var i = 0; i < last.length; i++) {
    this.children.push(last[i]);
  }
  this.initChild(child);
};

se.GameObject.prototype.addAfter = function (child, sibling) {
  child.destroy();
  var index = this.children.indexOf(sibling);
  if (index === -1) {
    this.addChild(child);
  } else {
    this.addAtIndex(child, index + 1);
  }
};

se.GameObject.prototype.initChild = function (child) {
  child.setParent(this);
  var scene = this.getScene();
  if (scene) {
    scene.setIdInObj(child);
  }
  if (child.rigidbody) {
    child.rigidbody.updateRealPosition();
    var parent = this;
    var flag = true;
    while (flag) {
      if (!parent) {
        flag = false;
      } else if (parent instanceof se.Scene) {
        flag = false;
        parent.addBody(child.rigidbody.body);
      } else if (parent.rigidbody) {
        this.rigidbody.addChild(child.rigidbody.body);
        flag = false;
      } else {
        parent = parent.parent;
      }
    }
  }
};

se.GameObject.prototype.remove = function (child) {
  child.setParent(null);
  var inx = this.children.indexOf(child);
  if (inx !== -1) {
    this.children.splice(inx, 1);
  }
  var scene = this.getScene();
  if (scene) {
    scene.remove(child);
  }
};

se.GameObject.prototype.destroy = function () {
  if (this.parent) {
    this.parent.remove(this);
  }
};

se.GameObject.prototype.setMesh = function (mesh) {
  this.mesh = mesh;
  mesh.setParent(this);
};

se.GameObject.prototype.isStatic = function (newvalue) {
  if (arguments.length && newvalue !== null && newvalue !== undefined) {
    this._isStatic = newvalue;
    if (this.rigidbody && this.rigidbody.body) {
      Matter.Body.setStatic(this.rigidbody.body, newvalue);
    }
  }
  return this._isStatic;
};

se.GameObject.prototype.clone = function () {
  var options = {
    vertices: this.mesh.vertices,
    angle: this.angle,
    isStatic: this.isStatic()
  };
  var x = this.transform.position.x;
  var y = this.transform.position.y;
  var obj = new this.constructor(this.name, x, y, options);
  if (this.rigidbody) {
    var b = this.rigidbody.body;
    var opt = {
      canRotate: b.canRotate
    };
    obj.setRigidBody(new se.RigidBody(opt));
  }
  if (this.renderer) {
    var renderer = this.renderer.clone();
    obj.setRenderer(renderer);
  }

  for (var i = 0; i < this.children.length; i++) {
    var c = this.children[i];
    obj.addChild(c.clone());
  }
  return obj;
};

se.GameObject.prototype.json = function () {
  var body = null;
  if (this.rigidbody) {
    body = this.rigidbody.json();
  }
  var rend = null;
  if (this.renderer) {
    rend = this.renderer.json();
  }
  var objs = [];
  for (var i = 0; i < this.children.length; i++) {
    objs.push(this.children[i].json());
  }
  return {
    type: 'GameObject',
    name: this.name,
    angle: this.angle,
    isStatic: this.isStatic(),
    transform: this.transform.json(),
    mesh: this.mesh.json(),
    rigidbody: body,
    children: objs,
    renderer: rend
  };
};

/*
  Transform
*/
se.Transform = function (parent, x, y) {
  this.parent = parent;
  this.position = new se.Point(x, y);
  this.rotate = new se.Point(1, 0);
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
  var pos = this.position;

  var obj = this.parent;
  var parent = obj.parent;
  if (parent instanceof se.GameObject) {
    var pos2 = parent.transform.getRealPosition();
    pos = pos.add(pos2);
  }

  return pos;
};

se.Transform.prototype.json = function () {
  return {
    type: 'Transform',
    position: this.position.json(),
    rotate: this.rotate.json()
  };
};

/*
  Interaction
*/
se.Interaction = function () {

};

se.Interaction.prototype.active = function () {

};

se.Interaction.prototype.desactive = function () {

};

se.Interaction.prototype.setParent = function (obj) {
  this.parent = obj;
  this.active();
};

se.Interaction.prototype.parseTouchToVector = function (touch) {
  return new se.Point(touch.pageX, touch.pageY);
};

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


/*
    Load
    */
se.load = {};

se.load.scene = function (json) {
  var rend = null;
  if (json.renderer) {
    rend = se.load.renderer(json.renderer);
  }
  var scene = new se.Scene(rend, true);
  for (var i = 0; i < json.objs.length; i++) {
    var o = json.objs[i];
    var obj = se.load.gameobject(o);
    scene.add(obj);
  }
  scene.setCamera(json.indexCamera);
  scene.zoomCamera = json.zoomCamera;
  return scene;
};

se.load.gameobject = function (json) {
  var vertices = se.load.points(json.mesh.vertices);
  var options = {
    angle: json.angle,
    isStatic: json.isStatic,
    vertices: vertices
  };
  var pos = json.transform.position;
  var obj = new se.GameObject(json.name, pos.x, pos.y, options);
  if (json.rigidbody) {
    obj.setRigidBody(new se.RigidBody(json.rigidbody));
  }
  if (json.renderer) {
    var rend = se.load.renderer(json.renderer);
    obj.setRenderer(rend);
  }
  for (var i = 0; i < json.children.length; i++) {
    var j = json.children[i];
    var child = se.load.gameobject(j);
    obj.addChild(child);
  }
  return obj;
};

se.load.point = function (json) {
  return new se.Point(json.x, json.y);
};

se.load.points = function (jsonarray) {
  var points = [];
  for (var i = 0; i < jsonarray.length; i++) {
    var o = jsonarray[i];
    var p = se.load.point(o);
    points.push(p);
  }
  return points;
};

se.load.renderer = function (json) {
  var rend = null;
  if (json.type === 'CircleRenderer') {
    rend = new se.CircleRenderer(json.radius, json.fillStyle, json.strokeStyle, json.lineWidth);
  } else if (json.type === 'RectRenderer') {
    rend = new se.RectRenderer(json.color, json.width, json.height);
  } else if (json.type === 'MeshRenderer') {
    rend = new se.MeshRenderer(json.fillColor, json.strokeStyle, json.lineWidth);
  } else if (json.type === 'ImageRenderer') {
    rend = new se.ImageRenderer(json.imageSrc, json.width, json.height);
  } else if (json.type === 'GradientRenderer') {
    rend = new se.GradientRenderer(json.color1, json.color2);
  }
  return rend;
};


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
se.Mesh.prototype.addVertice = function (vertice) {
  this.vertices.push(vertice);
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

se.Mesh.prototype.json = function () {
  var vertices = [];
  for (var i = 0; i < this.vertices.length; i++) {
    vertices.push(this.vertices[i].json());
  }
  return {
    type: 'Mesh',
    vertices: vertices
  };
};


/*
  Point
*/
se.Point = function (x, y) {
  this.x = x;
  this.y = y;
};

se.Point.prototype.equals = function (other) {
  return (this.x === other.x && this.y === other.y);
};

se.Point.prototype.clone = function () {
  return new se.Point(this.x, this.y);
};

se.Point.prototype.change = function (x, y) {
  this.x = x;
  this.y = y;
};

se.Point.prototype.getMagnitude = function () {
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

se.Point.prototype.sub = function (other, isSelf) {
  var out = isSelf ? this : new se.Point(0, 0);
  out.x = this.x - other.x;
  out.y = this.y - other.y;
  return out;
};

se.Point.prototype.add = function (other, isSelf) {
  var out = isSelf ? this : new se.Point(0, 0);
  out.x = this.x + other.x;
  out.y = this.y + other.y;
  return out;
};

se.Point.prototype.div = function (other, isSelf) {
  var out = isSelf ? this : new se.Point(0, 0);
  out.x = this.x / other.x;
  out.y = this.y / other.y;
  return out;
};

se.Point.prototype.mul = function (other, isSelf) {
  var out = isSelf ? this : new se.Point(0, 0);
  out.x = this.x * other.x;
  out.y = this.y * other.y;
  return out;
};

se.Point.prototype.neg = function (isSelf) {
  var out = isSelf ? this : new se.Point(0, 0);
  out.x = this.x * -1;
  out.y = this.y * -1;
  return out;
};

se.Point.prototype.calcDistance = function (Point) {
  // Catetos
  var dx = this.x - Point.x;
  var dy = this.y - Point.y;
  return Math.sqrt((dx * dx) + (dy * dy));
};

se.Point.prototype.json = function () {
  return {
    type: 'Point',
    x: this.x,
    y: this.y
  };
};


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

se.Renderer.prototype.json = function () {
  return {
    type: 'Renderer'
  };
};


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


/*
  Scene
  */
se.Scene = function (renderer, noCamera) {
  this.objs = [];
  this.colliders = [];
  this.collisionsActive = {};
  this.sequence = -1;
  this.indexObjs = {};

  if (!noCamera) {
    var camera = new se.GameObject('MainCamera', 0, 0, 0, 0);
    this.add(camera);
  }
  this._indexCamera = 0;
  this.zoomCamera = 1;

  this.renderer = renderer || new se.GradientRenderer('#004CB3', '#8ED6FF');
  this.renderer.setParent(this);

  // create a Matter.js engine
  this.matterengine = Matter.Engine.create();
  this.matterengine.enableSleeping = true;
};

se.Scene.prototype.getCamera = function () {
  return this.objs[this._indexCamera];
};

se.Scene.prototype.setCamera = function (obj) {
  if (typeof obj === 'number') {
    this._indexCamera = obj;
  } else {
    var i = this.objs.indexOf(obj);
    if (i !== -1) {
      this._indexCamera = i;
    }
  }
};

se.Scene.prototype.getObjs = function () {
  return this.objs;
};

se.Scene.prototype.setParent = function (parent) {
  this.parent = parent;
};

se.Scene.prototype.add = function (child) {
  child.destroy();
  this.objs.push(child);
  this.initChild(child);
};

se.Scene.prototype.addAtIndex = function (child, index) {
  child.destroy();
  var last = this.objs.splice(index);
  this.objs.push(child);
  for (var i = 0; i < last.length; i++) {
    this.objs.push(last[i]);
  }
  this.initChild(child);
};

se.Scene.prototype.addAfter = function (child, sibling) {
  child.destroy();
  var index = this.objs.indexOf(sibling);
  if (index === -1) {
    this.addChild(child);
  } else {
    this.addAtIndex(child, index + 1);
  }
};

se.Scene.prototype.initChild = function (obj) {
  obj.setParent(this);
  var children = obj.getChildren();
  if (obj.rigidbody) {
    this.addBody(obj.rigidbody.body);
  } else {
    for (var j = children.length - 1; j >= 0; j--) {
      var c = children[j];
      this.addBody(c.rigidbody.body);
    }
  }
  this.addColliders(obj.getColliders());
  this.setIdInObj(obj);
};

se.Scene.prototype.remove = function (obj) {
  obj.setParent(null);
  var cs = obj.getColliders();
  for (var i = 0; i < cs.length; i++) {
    this.removeCollider(cs[i]);
  }
  if (obj.rigidbody) {
    this.removeBody(obj.rigidbody.body);
  }

  var j = this.objs.indexOf(obj);
  if (j !== -1) {
    this.objs.splice(j, 1);
  }
  delete this.indexObjs[obj.id()];
};

se.Scene.prototype.setIdInObj = function (obj) {
  obj.id(this.nextId());
  this.indexObjs[obj.id()] = obj;
  for (var i = 0; i < obj.children.length; i++) {
    var c = obj.children[i];
    this.setIdInObj(c);
  }
};

se.Scene.prototype.nextId = function () {
  this.sequence ++;
  return this.sequence;
};
se.Scene.prototype.getObj = function (id) {
  return this.indexObjs[id];
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

se.Scene.prototype.removeCollider = function (collider) {
  var inx = this.colliders.indexOf(collider);
  if (inx !== -1) {
    this.colliders.splice(inx, 1);
  }
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

se.Scene.prototype.clone = function () {
  var scene = new se.Scene(this.renderer, true);
  var objs = this.getObjs();
  for (var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    var newobj = obj.clone();
    scene.add(newobj);
  }
  scene.setCamera(this._indexCamera);
  scene.zoomCamera = this.zoomCamera;
  return scene;
};

se.Scene.prototype.getObjectFromCoordinate = function (coordinate) {
  var objs = this.getObjs();
  for (var i = objs.length - 1; i >= 0; i--) {
    var obj = objs[i];
    if (obj.mesh.getExtent().containsXY(coordinate.x, coordinate.y)) {
      return obj;
    }
    var children = obj.getChildren();
    for (var j = children.length - 1; j >= 0; j--) {
      var c = children[j];
      if (c.mesh.getExtent().containsXY(coordinate.x, coordinate.y)) {
        return c;
      }
    }
  }
};

se.Scene.prototype.json = function () {
  var objs = [];
  for (var i = 0; i < this.objs.length; i++) {
    objs.push(this.objs[i].json());
  }
  return {
    type: 'Scene',
    renderer: this.renderer.json(),
    objs: objs,
    indexCamera: this._indexCamera,
    zoomCamera: this.zoomCamera
  };
};


/*
  Star Engine
*/
se.StarEngine = function (element) {
  this.element = element;

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

  this.viewport = this.viewport || null;
  if (!this.viewport && this.element) {
    this.viewport = new se.ViewPort(this.element);
  }

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

/*
  View Port
*/
se.ViewPort = function (elementID) {
  var self = this;
  this.interactions = [];
  this._scale = 1.0;

  if (elementID) {
    if (typeof elementID === 'string') {
      this.element = window.document.querySelector(elementID);
    } else {
      this.element = elementID;
    }
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
  return this.element.width / this._scale;
};

se.ViewPort.prototype.getHeight = function () {
  return this.element.height / this._scale;
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
  this.ctx.scale(this._scale, this._scale);

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
  scene.zoomCamera = this.scale();
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

se.ViewPort.prototype.removeInteraction = function (interaction) {
  var inx = this.interactions.indexOf(interaction);
  if (inx !== -1) {
    this.interactions.splice(inx, 1);
    interaction.desactive();
  }
};

se.ViewPort.prototype.desactiveInteractions = function () {
  for (var i = 0; i < this.interactions.length; i++) {
    this.interactions[i].desactive();
  }
};

se.ViewPort.prototype.activeInteractions = function () {
  for (var i = 0; i < this.interactions.length; i++) {
    this.interactions[i].active();
  }
};

// Get and Setter to scale
se.ViewPort.prototype.scale = function (newscale) {
  if (arguments.length) {
    newscale = parseFloat(newscale, 1) || 1;
    if (newscale > 0) {
      this._scale = newscale;
    }
  }
  return this._scale;
};

se.ViewPort.prototype.transformPixelToCoordinate = function (x, y) {
  var coor = new se.Point(x, y);
  var scale = new se.Point(this._scale, this._scale);
  coor.div(scale, true);
  return coor.add(this.pivot.position, true);
};

se.ViewPort.prototype.getExtent = function () {
  return new se.Extent(
    this.pivot.position.x,
    this.pivot.position.y,
    this.getWidth() + this.pivot.position.x,
    this.getHeight() + this.pivot.position.y
  );
};

se.ViewPort.prototype.getCenter = function () {
  return this.getExtent().getCenter();
};


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


/*
  ComponentScript
*/
se.ComponentScript = function (functionUpdate, functionResolveCollision) {
  se.Component.call(this);
  this.update = functionUpdate || function () {};
  this.resolveCollision = functionResolveCollision;
};

se.inherit(se.Component, se.ComponentScript);

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


/*
  DrawInteraction
  */
se.DrawInteraction = function (target) {
  se.Interaction.call(this);
  this.target = target;
  var self = this;
  this.last = null;

  this.click = function (e) {
    if (!self.target || e.detail > 1) {
      return null;
    }
    if (self.last && self.point.equals(self.last)) {
      return;
    }
    self.last = self.point;
    self.point = self.point.clone();
    self.target.mesh.addVertice(self.point);
  };

  this.end = function () {
    if (!self.target) {
      return null;
    }
    self.target.mesh.vertices.pop();
    self.finish();
  };

  this.mousemove = function (e) {
    self.move(e.offsetX, e.offsetY);
  };

  this.touchmove = function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      self.move(t.pageX, t.pageY);
    }
  };
};

se.inherit(se.Interaction, se.DrawInteraction);

se.drawStartEvent = new Event('seDrawStart');
se.drawEndEvent = new Event('seDrawEnd');

se.DrawInteraction.prototype.active = function () {
  var element = this.parent.element;
  this.point = new se.Point(0, 0);
  if (this.target) {
    this.target.mesh.addVertice(this.point);
  }

  element.addEventListener('click', this.click);
  element.addEventListener('dblclick', this.end);

  element.addEventListener('mousemove', this.mousemove);
  element.addEventListener('touchmove', this.touchmove);
};

se.DrawInteraction.prototype.desactive = function () {
  var element = this.parent.element;
  element.removeEventListener('click', this.click);
  element.removeEventListener('dblclick', this.end);
  element.removeEventListener('mousemove', this.mousemove);
  element.removeEventListener('touchmove', this.touchmove);
};

se.DrawInteraction.prototype.move = function (x, y) {
  if (!this.target) {
    return null;
  }
  var last = this.parent.transformPixelToCoordinate(x, y);
  this.point.change(last.x, last.y);
};

se.DrawInteraction.prototype.finish = function () {
  this.updateCenter();
  document.dispatchEvent(se.drawEndEvent);
  this.target = null;
};

se.DrawInteraction.prototype.updateCenter = function () {
  var center = this.target.mesh.getExtent().getCenter();
  for (var i = 0; i < this.target.mesh.vertices.length; i++) {
    var v = this.target.mesh.vertices[i];
    v.sub(center, true);
  }
  this.target.transform.move(center.x, center.y);
};

/*
  PanInteraction
  */
se.PanInteraction = function (target) {
  se.Interaction.call(this);
  var self = this;
  this.target = target;
  this.inverse = true;

  this.mousedown = function (e) {
    self.start(e.offsetX, e.offsetY);
  };
  this.mouseup = function () {
    self.end();
  };
  this.mousemove = function (e) {
    self.move(e.offsetX, e.offsetY);
  };
  this.touchstart = function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      self.start(t.pageX, t.pageY);
    }
  };
  this.touchend = function () {
    self.end();
  };
  this.touchmove = function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      self.move(t.pageX, t.pageY);
    }
  };
};

se.inherit(se.Interaction, se.PanInteraction);

se.panEndEvent = new Event('sePanEnd');

se.PanInteraction.prototype.active = function () {
  this.isDown = false;
  this.last = null;

  var element = this.parent.element;
  element.addEventListener('mousedown', this.mousedown);
  element.addEventListener('mouseup', this.mouseup);
  element.addEventListener('mousemove', this.mousemove);
  element.addEventListener('touchstart', this.touchstart);
  element.addEventListener('touchend', this.touchend);
  element.addEventListener('touchmove', this.touchmove);
};

se.PanInteraction.prototype.desactive = function () {
  var element = this.parent.element;
  element.removeEventListener('mousedown', this.mousedown);
  element.removeEventListener('mouseup', this.mouseup);
  element.removeEventListener('mousemove', this.mousemove);
  element.removeEventListener('touchstart', this.touchstart);
  element.removeEventListener('touchend', this.touchend);
};

se.PanInteraction.prototype.start = function (x, y) {
  this.last = new se.Point(x, y);
  this.isDown = true;
};

se.PanInteraction.prototype.end = function () {
  this.isDown = false;
  document.dispatchEvent(se.panEndEvent);
};

se.PanInteraction.prototype.move = function (x, y) {
  var viewport = this.parent;
  if (!this.isDown) {
    return;
  }
  var point = new se.Point(x, y);
  var newp = point.sub(this.last);
  if (this.inverse) {
    newp.neg(true);
  }
  var scale = viewport.scale();
  newp.div({x: scale, y: scale}, true);
  this.target.transform.move(newp.x, newp.y);
  this.last = point;
};


/*
    ZoomInteraction
    */
se.ZoomInteraction = function () {
  se.Interaction.call(this);
  var self = this;

  this.wheel = function (e) {
    var viewport = self.parent;
    var y = 0.05;
    if (e.deltaY > 0) {
      y *= -1;
    }
    var newscale = viewport.scale() + y;
    viewport.scale(newscale);
  };

  this.touchstart = function (e) {
    if (e.touches.length === 2) {
      var a1 = self.parseTouchToVector(e.touches[0]);
      var a2 = self.parseTouchToVector(e.touches[1]);
      self._distance = a1.calcDistance(a2);
    }
  };

  this.touchmove = function (e) {
    if (e.touches.length === 2) {
      var viewport = self.parent;
      var b1 = self.parseTouchToVector(e.touches[0]);
      var b2 = self.parseTouchToVector(e.touches[1]);
      var distance = b1.calcDistance(b2);

      var difference = 0;
      if (self._distance !== undefined) {
        difference = (distance - self._distance) * 2 / 1000;
      }
      self._distance = distance;

      var newscale = viewport.scale() + difference;
      viewport.scale(newscale);
    }
  };
};

se.inherit(se.Interaction, se.ZoomInteraction);

se.ZoomInteraction.prototype.active = function () {
  var element = this.parent.element;
  element.addEventListener('wheel', this.wheel);
  element.addEventListener('touchstart', this.touchstart);
  element.addEventListener('touchmove', this.touchmove);
};

se.ZoomInteraction.prototype.desactive = function () {
  var element = this.parent.element;
  element.removeEventListener('wheel', this.wheel);
  element.removeEventListener('touchstart', this.touchstart);
  element.removeEventListener('touchmove', this.touchmove);
};

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

se.CircleRenderer.prototype.json = function () {
  return {
    type: 'CircleRenderer',
    radius: this.radius,
    fillStyle: this.fillStyle,
    strokeStyle: this.strokeStyle,
    lineWidth: this.lineWidth
  };
};

/*
  EditRenderer - Based in Matter JS
  */
se.EditRenderer = function (fillColor, strokeStyle, lineWidth, pointColor) {
  se.Renderer.call(this);
  this.color = fillColor;
  this.strokeStyle = strokeStyle;
  this.lineWidth = lineWidth;
  this.pointColor = pointColor;
};

se.inherit(se.Renderer, se.EditRenderer);

se.EditRenderer.prototype.render = function (ctx) {
  var part = this.parent.mesh;
  var c = ctx;

  if (part.vertices.length) {
    this.renderMesh(c);
    this.renderPoints(c);
  }
  this.renderPosition(c);
};

se.EditRenderer.prototype.renderPosition = function (c) {
  // Draw position
  c.beginPath();
  var pos = this.parent.transform.position;
  c.fillStyle = 'red';
  c.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
  c.fill();
};

se.EditRenderer.prototype.renderMesh = function (c) {
  var part = this.parent.mesh;
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
se.EditRenderer.prototype.renderPoints = function (c) {
  var part = this.parent.mesh;
  c.fillStyle = this.pointColor;
  c.strokeStyle = 'white';
  c.lineWidth = 1;
  for (var i = 0; i < part.vertices.length; i++) {
    c.beginPath();
    c.arc(part.vertices[i].x, part.vertices[i].y, 3, 0, 2 * Math.PI);
    c.fill();
    c.stroke();
  }
};

se.EditRenderer.prototype.json = function () {
  return {
    type: 'EditRenderer',
    fillColor: this.color,
    strokeStyle: this.strokeStyle,
    lineWidth: this.lineWidth,
    pointColor: this.pointColor
  };
};

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

se.GradientRenderer.prototype.json = function () {
  return {
    type: 'GradientRenderer',
    color1: this.color1,
    color2: this.color2
  };
};


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

se.ImageRenderer.prototype.json = function () {
  return {
    type: 'ImageRenderer',
    imageSrc: this.img.src,
    width: this.width,
    height: this.height
  };
};

/*
  MeshRenderer - Based in Matter JS
*/
se.MeshRenderer = function (fillColor, strokeStyle, lineWidth) {
  se.Renderer.call(this);
  this.color = fillColor;
  this.strokeStyle = strokeStyle;
  this.lineWidth = lineWidth;
};

se.inherit(se.Renderer, se.MeshRenderer);

se.MeshRenderer.prototype.render = function (ctx) {
  var part = this.parent.mesh;
  var c = ctx;

  if (!part.vertices.length) {
    return;
  }

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

se.MeshRenderer.prototype.json = function () {
  return {
    type: 'MeshRenderer',
    fillColor: this.color,
    strokeStyle: this.strokeStyle,
    lineWidth: this.lineWidth
  };
};

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

se.RectRenderer.prototype.json = function () {
  return {
    type: 'RectRenderer',
    color: this.color,
    width: this.width,
    height: this.height
  };
};

