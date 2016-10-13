/* global se:true */
/* global window:true */
/* eslint no-undef: 'error' */

/*
  View Port
*/
se.ViewPort = function (elementID) {
  this.elementID = elementID;
  if (this.elementID) {
    this.element = window.document.getElementById(this.elementID);
  } else {
    this.element = window.document.body;
  }
  if (this.element.nodeName !== 'CANVAS') {
    var parent = this.element;
    this.element = window.document.createElement('canvas');
    parent.appendChild(this.element);
  }

  if (this.element.getContext) {
    this.ctx = this.element.getContext('2d');
  }
};

se.ViewPort.prototype.getContext = function () {
  return this.ctx;
};

se.ViewPort.prototype.getWidth = function () {
  return this.element.width;
};

se.ViewPort.prototype.getHeight = function () {
  return this.element.height;
};

