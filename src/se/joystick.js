/* global se:true */
/* global document:true */
/* eslint no-undef: 'error' */

/*
  Joystick
  */
se.Joystick = function () {
  this.x = 0;
  this.y = 0;
  this.jump = false;
  this.keyhandler = new se.KeyboardHandler(this);
};

se.Joystick.prototype.getAxis = function (name) {
  if (name === 'horizontal') {
    return this.x;
  }
  if (name === 'vertical') {
    return this.y;
  }
  if (name === 'jump') {
    return this.jump;
  }
  return 0;
};

se.Joystick.prototype.setAxis = function (name, val) {
  if (name === 'horizontal') {
    this.x = val;
  }
  if (name === 'vertical') {
    this.y = val;
  }
  if (name === 'jump') {
    this.jump = val;
  }
};

se.Joystick.prototype.resetAxis = function () {
  this.x = 0;
  this.y = 0;
  this.jump = false;
};

/*
  KeyboardHandler
*/
se.KeyboardHandler = function (joystick) {
  var self = this;
  this.joy = joystick;
  document.addEventListener('keydown', function (e) {
    var key = parseInt(e.keyCode, 0);
    self.keydown(key);
  });
  document.addEventListener('keyup', function (e) {
    var key = parseInt(e.keyCode, 0);
    self.keyup(key);
  });
};

se.KeyboardHandler.prototype.keydown = function (key) {
  if (key === 65 || key === 37) { // Left
    this.joy.setAxis('horizontal', -1);
  } else if (key === 68 || key === 39) { // 'right'
    this.joy.setAxis('horizontal', 1);
  } else if (key === 87 || key === 38) { // Up
    this.joy.setAxis('vertical', -1);
  } else if (key === 83 || key === 40) { // 'Down'
    this.joy.setAxis('vertical', 1);
  } else if (key === 32) { // 'Space'
    this.joy.setAxis('jump', true);
  }
};

se.KeyboardHandler.prototype.keyup = function (key) {
  if (key === 65 || key === 68 || key === 37 || key === 39) {
    this.joy.setAxis('horizontal', 0);
  } else if (key === 87 || key === 83 || key === 38 || key === 40) {
    this.joy.setAxis('vertical', 0);
  } else if (key === 32) {
    this.joy.setAxis('jump', false);
  }
};
