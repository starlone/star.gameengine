
/*
    Collider
*/
se.RectCollider = function (x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

se.RectCollider.createByExtent = function(extent){
    return new se.RectCollider(
        extent.min.x, extent.min.y, extent.max.x, extent.max.y
    );
}

se.RectCollider.prototype.setParent = function(obj){
    this.parent = obj;
    this._computeExtent();
}

se.RectCollider.prototype._computeExtent = function(){
    this.extent = new se.Extent(
        this.x, this.y, this.x + this.width, this.y + this.height);
}


se.RectCollider.prototype.getExtent = function(){
    var obj = this.parent;
    return this.extent.clone().move(obj.transform.getXY());
}

se.RectCollider.prototype.isIntersect = function(collider){
    var extent1 = this.getExtent();
    var extent2 = collider.getExtent();
    return extent1.intersects(extent2);
}

se.RectCollider.prototype.getIntersection = function(collider){
    if(collider instanceof Array){
        for(var i in collider){
            var c = collider[i];
            if(this._isIntersect(c))
                return this._getIntersection(c);
        }
    } else
        return this._getIntersection(collider);
    return null;
}

se.RectCollider.prototype._getIntersection = function(collider){
    var extent1 = this.getExtent();
    var extent2 = collider.getExtent();
    return extent1.getIntersection(extent2);
}

se.RectCollider.prototype.clone = function(){
    return new se.RectCollider(this.x, this.y, this.width, this.height);
}


