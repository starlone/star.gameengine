/*
    Windows Game
*/
se.WindowGame = function (elementID){
    var self = this;
    this.element = document.getElementById(elementID);
    if (this.element.getContext){
        this.ctx = canvas.getContext('2d');
    }
    this.scenes = [];
    this.joystick = new se.Joystick();
    self.updateSize();
    $(window).resize(function(){
        self.getSceneCurrent().resetCamera();
        self.updateSize();
    });
};

se.WindowGame.prototype.getWidth = function(){
    return this.element.width;
};

se.WindowGame.prototype.getHeight = function(){
    return this.element.height;
};

se.WindowGame.prototype.getSceneCurrent = function(){
    return this.scenes[0];
};

se.WindowGame.prototype.setSize = function(width, height){
    this.element.width = width;
    this.element.height = height;
}

se.WindowGame.prototype.updateSize = function(){
    var ele = $(this.element);
    var parent = ele.parent();
    this.setSize(parent.width(), parent.height());
}

se.WindowGame.prototype.getContext = function(){
    return this.ctx;
};

se.WindowGame.prototype.addScene = function(scene){
    this.scenes.push(scene);
    scene.parent = this;
};

se.WindowGame.prototype.render = function(){
    this.getSceneCurrent().render(this.ctx);
};

se.WindowGame.prototype.update = function(){
    this.render();
};

se.WindowGame.prototype.init = function(){
    se.windowGameMain = this;
    animationFrame(se.updateFrame);
};


