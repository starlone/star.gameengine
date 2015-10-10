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
se.Joystick.prototype.setAxis = function (name, val){
    if(name == 'horizontal') 
    	this.x = val;
    if(name == 'vertical') 
    	this.y = val;    
    if(name == 'jump') 
    	this.jump = val;
}
se.Joystick.prototype.resetAxis = function (name, val){
    this.x = 0;
    this.y = 0;    
    this.jump = false;
}

