/*
    Collider
*/
se.BoxCollider = function (x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

se.BoxCollider.prototype.setParent = function(obj){
    this.parent = obj;
}

se.BoxCollider.prototype.getPoints = function(){
    var obj = this.parent;
    var x = obj.getX() + this.x;
    var y = obj.getY() + this.y;
    var width = this.width;
    var height = this.height;
    
    var points = [];
    points.push([x, y]);
    points.push([x + width, y]);
    points.push([x, y + height]);
    points.push([x + width, y + height]);
    return points;
}

se.BoxCollider.prototype.isIntersect = function(collider){
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

se.BoxCollider.prototype._isIntersect = function(collider){
    var ps1 = this.getPoints();
    var ps2 = collider.getPoints();
    var min = ps2[0];
    var max = ps2[3];
    for(var i in ps1){
        if(ps1[i][0] > min[0] && ps1[i][0] < max[0] && ps1[i][1] > min[1] && ps1[i][1] < max[1])
            return true;
    }
    return false;
}

se.BoxCollider.prototype.clone = function(){
    return new se.BoxCollider(this.x, this.y, this.width, this.height);
}

