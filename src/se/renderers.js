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

