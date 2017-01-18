/* global se:true */
/* eslint no-undef: 'error' */

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

