/*
    ComponentFollowPlayer
*/
se.ComponentFollowObject = function (obj_target){
    se.Component.call(this);
    this.obj_target = obj_target;
};

se.inherit(se.Component, se.ComponentFollowObject);

se.ComponentFollowObject.prototype.update = function(obj){
    obj.transform.position.x = this.obj_target.transform.position.x;
    obj.transform.position.y = this.obj_target.transform.position.y;
};
