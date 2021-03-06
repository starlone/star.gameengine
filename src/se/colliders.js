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

