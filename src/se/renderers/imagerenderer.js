/*
  ImageRenderer
*/

se.ImageRenderer = function (imageSrc, width, height) {
  se.Renderer.call(this);
  this.img = new Image();
  this.img.src = imageSrc;
  this.width = width;
  this.height = height;
};

se.inherit(se.Renderer, se.ImageRenderer);

se.ImageRenderer.prototype.render = function (ctx) {
  ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
};

se.ImageRenderer.prototype.json = function () {
  return {
    type: 'ImageRenderer',
    imageSrc: this.img.src,
    width: this.width,
    height: this.height
  };
};
