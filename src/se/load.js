
/*
    Load
    */
se.load = {};

se.load.scene = function (json) {
  var scene = new se.Scene();
  for (var i = 0; i < json.objs.length; i++) {
    var o = json.objs[i];
    var obj = se.load.gameobject(o);
    scene.add(obj);
  }
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

