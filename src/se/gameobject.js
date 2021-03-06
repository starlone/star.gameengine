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
