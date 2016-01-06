
/*
    Extent
*/
se.Extent = function (min_x, min_y, max_x, max_y){
    this.min = {x: min_x, y: min_y};
    this.max = {x: max_x, y: max_y};
};

se.Extent.createEmpty = function() {
    return new se.Extent(Infinity, Infinity, -Infinity, -Infinity);
};

se.Extent.prototype.isEmpty = function(extent) {
    return this.max.x < this.min.x || this.max.y < this.min.y;
};

se.Extent.prototype.intersects = function(extent) {
    return this.min.x <= extent.max.x &&
           this.max.x >= extent.min.x &&
           this.min.y <= extent.max.y &&
           this.max.y >= extent.min.y;
};


se.Extent.prototype.getIntersection = function(extent) {
    var intersection = se.Extent.createEmpty();
    if (this.intersects(extent)) {
        if (this.min.x > extent.min.x) {
            intersection.min.x = this.min.x;
        } else {
            intersection.min.x = extent.min.x;
        }
        if (this.min.y > extent.min.y) {
            intersection.min.y = this.min.y;
        } else {
            intersection.min.y = extent.min.y;
        }
        if (this.max.x < extent.max.x) {
            intersection.max.x = this.max.x;
        } else {
            intersection.max.x = extent.max.x;
        }
        if (this.max.y < extent.max.y) {
            intersection.max.y = this.max.y;
        } else {
            intersection.max.y = extent.max.y;
        }
    } else
        return null;
    return intersection;
};

se.Extent.prototype.getWidth = function() {
    return this.max.x - this.min.x;
}

se.Extent.prototype.getHeight = function() {
    return this.max.y - this.min.y;
}
