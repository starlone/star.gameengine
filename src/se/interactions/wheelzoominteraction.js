/* global se:true */
/* eslint no-undef: 'error' */

/*
    WheelZoomInteraction
  */
se.WheelZoomInteraction = function () {
  se.Interaction.call(this);
};

se.inherit(se.Interaction, se.WheelZoomInteraction);

se.WheelZoomInteraction.prototype.init = function () {
  var viewport = this.parent;
  viewport.element.addEventListener('wheel', function (e) {
    var y = 0.05;
    if (e.deltaY < 0) {
      y *= -1;
    }
    var scale = viewport.scale();
    scale += y;
    viewport.scale(scale);
  });
};
