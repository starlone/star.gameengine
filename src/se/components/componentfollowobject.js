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
