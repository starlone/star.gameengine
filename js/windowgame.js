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
    scene.parent = this;
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
    this.camera = new GameObject('MainCamera',0,0,0,0);
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
Scene.prototype.getObjs = function(){
    return this.objs;
};
Scene.prototype.setSize = function(width,height){
    this.width = width;
    this.height = height;
}
Scene.prototype.add = function(obj){
    this.objs.push(obj);
    obj.parent = this;
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


function GameObject(name, x, y, width, height){
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.components = [];
    this.colliders = [];
};
GameObject.prototype.getX = function(){
    return this.x;
};
GameObject.prototype.getY = function(){
    return this.y;
};
GameObject.prototype.getColliders = function(){
    return this.colliders;
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
    component.parent = this;
    return this;
};
GameObject.prototype.addCollider = function(collider){
    this.colliders.push(collider);
    collider.parent = this;
    return this;
};
GameObject.prototype.move = function(x,y){
    this.x = x;
    this.y = y;
};
GameObject.prototype.sum = function(x,y){
    var xb = this.x;
    var yb = this.y;
    this.x += x;
    this.y += y;
    if(this.checkCollision()){
        this.x = xb;
        this.y = yb;        
    }
};
GameObject.prototype.checkCollision = function(x,y){
    var scene = this.parent;
    var objs = scene.getObjs();    
    for(var i in objs){
        var obj = objs[i];        
        if(this.name != obj.name){
            if( checkColliders( this.getColliders(), obj.getColliders() ) )
                return true;
        }
    }
    return false;
}

function checkColliders(cols1, cols2){        
    for(var i in cols1){
        for(var j in cols2){
            var col1 = cols1[i];                        
            var col2 = cols2[j];
            var ps1 = col1.getPoints();
            var ps2 = col2.getPoints();
            if(checkPolygonContido(ps1,ps2)){
                return true;
            }
                        
        }
    }
    return false;
}

function checkPolygonContido(ps1, ps2){
    var min = ps2[0];
    var max = ps2[3];
    
    for(var i in ps1){
        if(ps1[i][0] >= min[0] && ps1[i][0] <= max[0] && ps1[i][1] >= min[1] && ps1[i][1] <= max[1])
            return true;
    }
    return false;
}

function Joystick(){
    this.key = null;
    var self = this;
    var x = 0;
    var y = 0;
    $(document).keydown(function(e){
        self.key = e.keyCode;
        self.update();
    });
    $(document).keyup(function(e){
        self.key = null;
        self.reset();
    });
}

Joystick.prototype.update = function(){
    var key = this.key;
    if (key == '65'){ // Left
        this.x = -1;
    } else if (key == '68'){ // 'right'
        this.x = 1;
    } else if (key == '87'){ // Up
        this.y = -1;
    } else if (key == '83'){ // 'Down'
        this.y = 1;
    }
}

Joystick.prototype.reset = function (){
    this.x = 0;
    this.y = 0;
}

Joystick.prototype.getAxis = function (name){
    if(name == 'horizontal') return this.x;
    if(name == 'vertical') return this.y;    
    return 0;
}


function ComponentScript(function_update){
    this.update = function_update;
};


function ComponentPlayer(game,speed,gravity){
    this.window = game;
    this.speed = speed;
};
ComponentPlayer.prototype.update = function(obj){
    var x = game.joystick.getAxis('horizontal') * this.speed;
    var y = game.joystick.getAxis('vertical') * this.speed;
    if(x || y)
        obj.sum(x,y);
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


function ComponentRigidBody(gravity){
    this.gravity = gravity;
}

ComponentRigidBody.prototype.update = function(obj){
    obj.sum(0, this.gravity);
}

function Collider(x1,y1,x2,y2){
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
}

Collider.prototype.getPoints = function(obj){
    var pai = this.parent;
    var lista = [];
        
    lista.push([pai.x, pai.y]);
    lista.push([pai.x + pai.width, pai.y]);
    lista.push([pai.x, pai.y + pai.height]);
    lista.push([pai.x + pai.width, pai.y + pai.height]);
        
    return lista;
}

