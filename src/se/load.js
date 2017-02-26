
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
  return scene;
};

se.load.gameobject = function (json) {
  var vertices = se.load.points(json.mesh.vertices);
  var options = {
    angle: json.angle,
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

