/*
    Joystick
*/
se.Joystick = function (){
    var x = 0;
    var y = 0;
    this.jump = false;
    this.keyhandler = new se.KeyboardHandler(this);
}

se.Joystick.prototype.getAxis = function (name){
    if(name == 'horizontal') return this.x;
    if(name == 'vertical') return this.y;    
    if(name == 'jump') return this.jump;
    return 0;
}

se.Joystick.prototype.setAxis = function (name, val){
    if(name == 'horizontal') 
        this.x = val;
    if(name == 'vertical') 
        this.y = val;    
    if(name == 'jump') 
        this.jump = val;
}

se.Joystick.prototype.resetAxis = function (){
    this.x = 0;
    this.y = 0;    
    this.jump = false;
}



/*
    KeyboardHandler
*/
se.KeyboardHandler = function (joystick){
    var self = this;
    this.joy = joystick;
    $(document).keydown(function(e){
        self.keydown(e.keyCode);
    });
    $(document).keyup(function(e){
        self.keyup(e.keyCode);
    });
}

se.KeyboardHandler.prototype.keydown = function(key){
    if (key == '65'){ // Left
        this.joy.setAxis('horizontal',-1);
    } else if (key == '68'){ // 'right'
        this.joy.setAxis('horizontal',1);
    } else if (key == '87'){ // Up
        this.joy.setAxis('vertical', -1);
    } else if (key == '83'){ // 'Down'
        this.joy.setAxis('vertical', 1);
    } else if (key == '32'){ // 'Space'
        this.joy.setAxis('jump', true);
    }
}

se.KeyboardHandler.prototype.keyup = function(key){
    if (key == '65' || key == '68'){ 
        this.joy.setAxis('horizontal',0);
    } else if (key == '87' || key == '83'){
        this.joy.setAxis('vertical', 0);
    } else if (key == '32'){
        this.joy.setAxis('jump', false);
    }
}
