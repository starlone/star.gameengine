/*
    Star Engine
*/
se.StarEngine = function (elementID){
    var self = this;
    this.element = document.getElementById(elementID);
    if (this.element.getContext){
        this.ctx = canvas.getContext('2d');
    }
    this.lastTime = Date.now();
    this.scenes = [];
    this.joystick = new se.Joystick();
    self.updateSize();
    window.addEventListener('resize',function(){
        self.getSceneCurrent().resetCamera();
        self.updateSize();
    });
};

se.StarEngine.prototype.getWidth = function(){
    return this.element.width;
};

se.StarEngine.prototype.getHeight = function(){
    return this.element.height;
};

se.StarEngine.prototype.getSceneCurrent = function(){
    return this.scenes[0];
};

se.StarEngine.prototype.setSize = function(width, height){
    this.element.width = width;
    this.element.height = height;
}

se.StarEngine.prototype.updateSize = function(){
    var ele = this.element;
    var parent = ele.parentElement;
    this.setSize(parent.offsetWidth, parent.offsetHeight);
}

se.StarEngine.prototype.getContext = function(){
    return this.ctx;
};

se.StarEngine.prototype.addScene = function(scene){
    this.scenes.push(scene);
    scene.setParent(this);
};

se.StarEngine.prototype.update = function(){
    var now = Date.now();
    var deltaTime = (now - this.lastTime) / 1000.0;
    var scene = this.getSceneCurrent();
    scene.update(deltaTime);
    scene.render(this.ctx);
    this.lastTime = now;
};

se.StarEngine.prototype.init = function(){
    se.windowGameMain = this;
    animationFrame(se.updateFrame);
};


