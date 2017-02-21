/*
  Scene
*/
se.Scene = function (renderer, noCamera) {
  this.objs = [];
  this.colliders = [];
  this.collisionsActive = {};

  if (!noCamera) {
    var camera = new se.GameObject('MainCamera', 0, 0, 0, 0);
    this.add(camera);    
  }
  this._indexCamera = 0;

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

se.Scene.prototype.clone = function () {
  var scene = new se.Scene(this.renderer, true);
  var objs = this.getObjs();
  for (var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    var newobj = obj.clone();
    scene.add(newobj);
  }
  scene.setCamera(this._indexCamera);
  return scene;
};

se.Scene.prototype.getObjectFromCoordinate = function (coordinate) {
  var objs = this.getObjs();
  for (var i = objs.length - 1; i >= 0; i--) {
    var obj = objs[i];
    if (obj.mesh.getExtent().containsXY(coordinate.x, coordinate.y)) {
      return obj;
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
    objs: objs
  };
};

