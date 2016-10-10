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

