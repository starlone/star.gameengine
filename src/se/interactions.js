/*
  Interaction
*/
se.Interaction = function () {

};

se.Interaction.prototype.init = function () {

};

se.Interaction.prototype.setParent = function (obj) {
  this.parent = obj;
  this.init();
};

se.Interaction.prototype.parseTouchToVector = function (touch) {
  return new se.Point(touch.pageX, touch.pageY);
};
