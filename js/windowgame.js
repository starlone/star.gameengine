window.animationFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var windowGameMain = null;

function updateFrame(){
    windowGameMain.update();
    animationFrame(updateFrame);
}

function WindowGame(elementID){
    var self = this;
    this.element = document.getElementById(elementID);
    if (this.element.getContext){
        this.ctx = canvas.getContext('2d');
    }
    this.scenes = [];
    this.key = null;

    $(document).keypress(function(e){
        self.key = e.key;
    });
};
WindowGame.prototype.getWidth = function(){
    return this.element.width
};
WindowGame.prototype.getHeight = function(){
    return this.element.height
};
WindowGame.prototype.clrscr = function(){
    this.ctx.clearRect(0,0,this.getWidth(), this.getHeight());
};
WindowGame.prototype.getContext = function(){
    return this.ctx;
};
WindowGame.prototype.addScene = function(scene){
    this.scenes.push(scene);
};
WindowGame.prototype.getSceneCurrent = function(){
    return this.scenes[0];
};
WindowGame.prototype.getKeyPress = function(){
    var key = this.key;
    this.key = null;
    return key;
};
WindowGame.prototype.render = function(){
    this.getSceneCurrent().render(this.ctx);
};
WindowGame.prototype.update = function(){
    this.clrscr();
    this.render();
};
WindowGame.prototype.init = function(){
    windowGameMain = this;
    animationFrame(updateFrame);    
};




function Scene(){
    this.objs = [];
};
Scene.prototype.add = function(obj){
    this.objs.push(obj);
};
Scene.prototype.render = function(ctx){
    for(var i in this.objs){
        this.objs[i].render(ctx);
    }
};


function GameObject(x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this._update = function(){};
};
GameObject.prototype.render = function(ctx){
    this._update();
    ctx.fillRect(this.x,this.y,this.width,this.height);
};
GameObject.prototype.update = function(funcao){
    this._update = funcao;
};

