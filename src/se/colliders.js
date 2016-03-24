/*
    Collider
*/
se.RectCollider = function (x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

se.RectCollider.prototype.setParent = function(obj){
    this.parent = obj;
}

se.RectCollider.prototype.getExtent = function(){
    var obj = this.parent;
    var x = obj.getX() + this.x;
    var y = obj.getY() + this.y;
    var width = this.width;
    var height = this.height;
    return new se.Extent(x, y, x + width, y + height);
}

se.RectCollider.prototype.isIntersect = function(collider){
    if(collider instanceof Array){
        for(var i in collider){
            var c = collider[i];
            if(this._isIntersect(c))
                return true;
        }
    } else
        return this._isIntersect(collider);
    return false;
}

se.RectCollider.prototype._isIntersect = function(collider){
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


