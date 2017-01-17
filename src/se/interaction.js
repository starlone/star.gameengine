/* global se:true */
/* eslint no-undef: 'error' */

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
  return new se.Vector(touch.pageX, touch.pageY);
};
