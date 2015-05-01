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
    this.joystick = new Joystick();
};
WindowGame.prototype.getWidth = function(){
    return this.element.width
};
WindowGame.prototype.getHeight = function(){
    return this.element.height
};
WindowGame.prototype.getSceneCurrent = function(){
    return this.scenes[0];
};
WindowGame.prototype.setSize = function(width, height){
	var elem = this.element;
    this.element.width = width;
    this.element.height = height;
	this.getSceneCurrent().setSize(width, height);
}
WindowGame.prototype.updateSize = function(){
	var width = this.getWidth();
	var height = this.getHeight();
	if (width != window.innerWidth || height != window.innerHeight)
		this.setSize(window.innerWidth, window.innerHeight);
}
WindowGame.prototype.clrscr = function(){
    this.ctx.clearRect(0,0,this.getWidth(), this.getHeight());
};
WindowGame.prototype.getContext = function(){
    return this.ctx;
};
WindowGame.prototype.addScene = function(scene){
    this.scenes.push(scene);
};
WindowGame.prototype.render = function(){
    this.getSceneCurrent().render(this.ctx);
};
WindowGame.prototype.update = function(){
    // this.updateSize();
    this.render();
};
WindowGame.prototype.init = function(){
    windowGameMain = this;
    animationFrame(updateFrame);
};


function Scene(width,height){
	this.width = width;
	this.height = height;
	this.camera = new GameObject(0,0,0,0);
	this.camX = 0;
	this.camY = 0;
    this.objs = [this.camera];
};
Scene.prototype.getWidth = function(){
    return this.width
};
Scene.prototype.getHeight = function(){
    return this.height
};
Scene.prototype.getCamera = function(){
	return this.camera;
};
Scene.prototype.setSize = function(width,height){
	this.width = width;
	this.height = height;
}
Scene.prototype.add = function(obj){
    this.objs.push(obj);
};
Scene.prototype.render = function(ctx){
	this.check_move_cam(ctx);
	this.clear(ctx);
    for(var i in this.objs){
        this.objs[i].render(ctx);
    }
};
Scene.prototype.clear = function(ctx){
    ctx.clearRect(
		this.camera.getX(),
		this.camera.getY(),
		this.getWidth(), 
		this.getHeight()
	);
}
Scene.prototype.check_move_cam = function(ctx){
	if(this.camX != this.camera.getX() || this.camY != this.camera.getY()){
	    var x = this.camX - this.camera.getX();
		var y = this.camY - this.camera.getY();
		ctx.translate(x,y);
		this.camX = this.camera.getX();
		this.camY = this.camera.getY();
	} 
}


function GameObject(x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
	this.components = [];
};
GameObject.prototype.getX = function(){
	return this.x;
};
GameObject.prototype.getY = function(){
	return this.y;
};
GameObject.prototype.render = function(ctx){
	this.update();
    ctx.fillRect(this.x,this.y,this.width,this.height);
};
GameObject.prototype.update = function(){
	for(var i in this.components){
		this.components[i].update(this);
	}
};
GameObject.prototype.addComponent = function(component){
	this.components.push(component);
	return this;
};
GameObject.prototype.move = function(x,y){
    this.x = x;
    this.y = y;
};


function Joystick(){
	this.key = null;
	var self = this;
	$(document).keydown(function(e){
        self.key = e.keyCode;
    });
	$(document).keyup(function(e){
        self.key = null;
    });
}
Joystick.prototype.getKeyPress = function(){
    var key = this.key;
    this.key = null;
    return key;
};

Joystick.prototype.getAxis = function (name){
	var key = this.key;
	var val = 0;
	if(name == 'horizontal'){
		if (key == '65'){ // Left
			val =  -1;
		} else if (key == '68'){ // 'right'
			val = 1;			
		}
	} 
	if(name == 'vertical'){
		if (key == '87'){ // Left
			val =  -1;
		} else if (key == '83'){ // 'right'
			val = 1;			
		}
	}
	
//	
//	
//	else if(name == 'vertical'){
//		if (key == '119'){ // up
//			val = 1;
//		} else if (key == '115'){ // down
//			val = -1;
//		}
//	}
	return val;
}


function ComponentScript(function_update){
	this.update = function_update;
};


function ComponentPlayer(game,speed){
	this.window = game;
	this.speed = 4;
	if(speed)
		this.speed = speed;
};
ComponentPlayer.prototype.update = function(obj){
	var hor = game.joystick.getAxis('horizontal');	
	if (hor){
		obj.x += hor * this.speed;
	}
	var ver = game.joystick.getAxis('vertical');
	if (ver){
		obj.y += ver * this.speed;
	}
};

function ComponentFollowPlayer(obj_player){
	this.obj_player = obj_player;
}
ComponentFollowPlayer.prototype.update = function(obj){
	var game = windowGameMain;

	var posx = game.getWidth() / 2 - this.obj_player.width / 2;
	posx = this.obj_player.x + (this.obj_player.width / 2) - posx;
	var posy = game.getHeight() / 2 - this.obj_player.height / 2;
	posy = this.obj_player.y + (this.obj_player.height / 2) - posy;

	obj.move(posx,posy);
}


