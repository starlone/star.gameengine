
/*
    Extent
*/
se.Extent = function (min_x, min_y, max_x, max_y){
    this.min = {x: min_x, y: min_y};
    this.max = {x: max_x, y: max_y};
}

se.Extent.prototype.intersects = function(extent) {
  return this.min.x <= extent.max.x &&
         this.max.x >= extent.min.x &&
         this.min.y <= extent.max.y &&
         this.max.y >= extent.min.y;
};


