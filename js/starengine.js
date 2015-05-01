/*
    Star Engine
*/

var se = new Object();

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

se.windowGameMain = null;

se.updateFrame = function (){
    se.windowGameMain.update();
    animationFrame(se.updateFrame);
}


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
};
se.WindowGame.prototype.getWidth = function(){
    return this.element.width
};
se.WindowGame.prototype.getHeight = function(){
    return this.element.height
};
se.WindowGame.prototype.getSceneCurrent = function(){
    return this.scenes[0];
};
se.WindowGame.prototype.setSize = function(width, height){
    var elem = this.element;
    this.element.width = width;
    this.element.height = height;
    this.getSceneCurrent().setSize(width, height);
}
se.WindowGame.prototype.updateSize = function(){
    var width = this.getWidth();
    var height = this.getHeight();
    if (width != window.innerWidth || height != window.innerHeight)
        this.setSize(window.innerWidth, window.innerHeight);
}
se.WindowGame.prototype.clrscr = function(){
    this.ctx.clearRect(0,0,this.getWidth(), this.getHeight());
};
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
    // this.updateSize();
    this.render();
};
se.WindowGame.prototype.init = function(){
    se.windowGameMain = this;
    animationFrame(se.updateFrame);
};


/*
    Scene
*/
se.Scene = function (width,height){
    this.width = width;
    this.height = height;
    this.camera = new se.GameObject('MainCamera',0,0,0,0);
    this.camera.parent = this;
    this.camX = 0;
    this.camY = 0;
    this.objs = [this.camera];
};
se.Scene.prototype.getWidth = function(){
    return this.width
};
se.Scene.prototype.getHeight = function(){
    return this.height
};
se.Scene.prototype.getCamera = function(){
    return this.camera;
};
se.Scene.prototype.getObjs = function(){
    return this.objs;
};
se.Scene.prototype.setSize = function(width,height){
    this.width = width;
    this.height = height;
}
se.Scene.prototype.add = function(obj){
    this.objs.push(obj);
    obj.parent = this;
};
se.Scene.prototype.render = function(ctx){
    this.check_move_cam(ctx);
    this.clear(ctx);
    for(var i in this.objs){
        this.objs[i].render(ctx);
    }
};
se.Scene.prototype.clear = function(ctx){
    ctx.clearRect(
        this.camera.getX(),
        this.camera.getY(),
        this.getWidth(), 
        this.getHeight()
    );
}
se.Scene.prototype.check_move_cam = function(ctx){
    if(this.camX != this.camera.getX() || this.camY != this.camera.getY()){
        var x = this.camX - this.camera.getX();
        var y = this.camY - this.camera.getY();
        ctx.translate(x,y);
        this.camX = this.camera.getX();
        this.camY = this.camera.getY();
    } 
}


/*
    GameObject
*/
se.GameObject = function (name, x, y, width, height){
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.components = [];
    this.colliders = [];
};
se.GameObject.prototype.getX = function(){
    return this.x;
};
se.GameObject.prototype.getY = function(){
    return this.y;
};
se.GameObject.prototype.getWidth = function(){
    return this.width;
};
se.GameObject.prototype.getHeight = function(){
    return this.height;
};
se.GameObject.prototype.getColliders = function(){
    return this.colliders;
};
se.GameObject.prototype.render = function(ctx){
    this.update();
    ctx.fillRect(this.x,this.y,this.width,this.height);
};
se.GameObject.prototype.update = function(){
    for(var i in this.components){
        this.components[i].update(this);
    }
};
se.GameObject.prototype.addComponent = function(component){
    this.components.push(component);
    component.parent = this;
    return this;
};
se.GameObject.prototype.addCollider = function(collider){
    this.colliders.push(collider);
    collider.parent = this;
    return this;
};
se.GameObject.prototype.move = function(x,y){
    this.x = x;
    this.y = y;
};
se.GameObject.prototype.sum = function(x,y){
    var xb = this.x;
    var yb = this.y;
    this.x += x;
    this.y += y;
    if(this.checkCollision()){
        this.x = xb;
        this.y = yb;        
    }
};
se.GameObject.prototype.checkCollision = function(x,y){
    var scene = this.parent;
    var objs = scene.getObjs();    
    for(var i in objs){
        var obj = objs[i];        
        if(this.name != obj.name){
            if( se.checkColliders( this.getColliders(), obj.getColliders() ) )
                return true;
        }
    }
    return false;
}


/*
    Joystick
*/
se.Joystick = function (){
    this.key = null;
    var self = this;
    var x = 0;
    var y = 0;
    this.jump = false;
    $(document).keydown(function(e){
        self.key = e.keyCode;
        self.update();
    });
    $(document).keyup(function(e){
        self.key = null;
        self.reset();
    });
}

se.Joystick.prototype.update = function(){
    var key = this.key;
    if (key == '65'){ // Left
        this.x = -1;
    } else if (key == '68'){ // 'right'
        this.x = 1;
    } else if (key == '87'){ // Up
        this.y = -1;
    } else if (key == '83'){ // 'Down'
        this.y = 1;
    } else if (key == '32'){ // 'Space'
        this.jump = true
    }
}

se.Joystick.prototype.reset = function (){
    this.x = 0;
    this.y = 0;
    this.jump = false;
}

se.Joystick.prototype.getAxis = function (name){
    if(name == 'horizontal') return this.x;
    if(name == 'vertical') return this.y;    
    if(name == 'jump') return this.jump;
    return 0;
}


/*
    ComponentScript
*/
se.ComponentScript = function (function_update){
    this.update = function_update;
};


/*
    ComponentPlayer
*/
se.ComponentPlayer = function (game,speed,gravity){
    this.window = game;
    this.speed = speed;
};
se.ComponentPlayer.prototype.update = function(obj){
    var x = game.joystick.getAxis('horizontal') * this.speed;
    if(x)
        obj.sum(x,0);
    //var y = game.joystick.getAxis('vertical') * this.speed;
    if(game.joystick.getAxis('jump')){
        obj.sum(0, -1 * this.speed * 2);
    }
};


/*
    ComponentFollowPlayer
*/
se.ComponentFollowPlayer = function (obj_player){
    this.obj_player = obj_player;
}
se.ComponentFollowPlayer.prototype.update = function(obj){
	var scene = this.parent.parent;
	
    var posx = scene.getWidth() / 2 - this.obj_player.width / 2;
    posx = this.obj_player.x + (this.obj_player.width / 2) - posx;
    var posy = scene.getHeight() / 2 - this.obj_player.height / 2;
    posy = this.obj_player.y + (this.obj_player.height / 2) - posy;

    obj.move(posx,posy);
}


/*
    ComponentRigidBody
*/
se.ComponentRigidBody = function (gravity){
    this.gravity = gravity;
}

se.ComponentRigidBody.prototype.update = function(obj){
    obj.sum(0, this.gravity);
}


/*
    Collider
*/
se.Collider = function (x1,y1,x2,y2){
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
}

se.Collider.prototype.getPoints = function(obj){
    var pai = this.parent;
    var lista = [];

    lista.push([pai.x, pai.y]);
    lista.push([pai.x + pai.width, pai.y]);
    lista.push([pai.x, pai.y + pai.height]);
    lista.push([pai.x + pai.width, pai.y + pai.height]);

    return lista;
}


/*
    Functions utils 
*/

se.checkColliders = function (cols1, cols2){
    for(var i in cols1){
        for(var j in cols2){
            var col1 = cols1[i];
            var col2 = cols2[j];
            var ps1 = col1.getPoints();
            var ps2 = col2.getPoints();
            if(se.checkPolygonContido(ps1,ps2)){
                return true;
            }
        }
    }
    return false;
}

se.checkPolygonContido = function (ps1, ps2){
    var min = ps2[0];
    var max = ps2[3];

    for(var i in ps1){
        if(ps1[i][0] >= min[0] && ps1[i][0] <= max[0] && ps1[i][1] >= min[1] && ps1[i][1] <= max[1])
            return true;
    }
    return false;
}