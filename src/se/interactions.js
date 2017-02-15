/*
  Interaction
*/
se.Interaction = function () {

};

se.Interaction.prototype.active = function () {

};

se.Interaction.prototype.desactive = function () {

};

se.Interaction.prototype.setParent = function (obj) {
  this.parent = obj;
  this.active();
};

se.Interaction.prototype.parseTouchToVector = function (touch) {
  return new se.Point(touch.pageX, touch.pageY);
};
