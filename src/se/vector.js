/*
   Vector
*/
se.Vector = function (x, y){
    this.x = x;
    this.y = y;
};

se.Vector.prototype.equals = function(other){
    return (this.x == other.x && this.y == other.y);
};

se.Vector.prototype.clone = function(){
    return new se.Vector(this.x, this.y);
};

se.Vector.prototype.change = function (x, y){
    this.x = x;
    this.y = y;
};

se.Vector.prototype.getMagnitude = function (){
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};


