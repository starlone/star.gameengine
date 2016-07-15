/*
    Star Engine
*/
se.StarEngine = function (elementID){
    var self = this;
    if(elementID)
        this.element = document.getElementById(elementID);
    else
        this.element = document.body;

    if (this.element.getContext){
        this.ctx = this.element.getContext('2d');
    }
    this.scenes = [];
    this.joystick = new se.Joystick();
    self.updateSize();

    window.addEventListener('resize',function(){
        self.getSceneCurrent().resetCamera();
        self.updateSize();
    });

    var defaults = {
        fps: 60,
        correction: 1,
        deltaSampleSize: 60,
        counterTimestamp: 0,
        frameCounter: 0,
        deltaHistory: [],
        timePrev: null,
        timeScalePrev: 1,
        frameRequestId: null,
        isFixed: false,
        enabled: true,
        timing: {
            timestamp: 0,
            timeScale: 1
        }
    };
    var runner = defaults;
    runner.delta = runner.delta || 1000 / runner.fps;
    runner.deltaMin = runner.deltaMin || 1000 / runner.fps;
    runner.deltaMax = runner.deltaMax || 1000 / (runner.fps * 0.5);
    runner.fps = 1000 / runner.delta;
    this.runner = runner;
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
};

se.StarEngine.prototype.updateSize = function(){
    var ele = this.element;
    var parent = ele.parentElement;
    this.setSize(parent.offsetWidth, parent.offsetHeight);
};

se.StarEngine.prototype.getContext = function(){
    return this.ctx;
};

se.StarEngine.prototype.addScene = function(scene){
    this.scenes.push(scene);
    scene.setParent(this);
};

se.StarEngine.prototype.update = function(time){
    var runner = this.runner;

    var timing = runner.timing,
        correction = 1,
        delta;

    // create an event object
    var event = { timestamp: timing.timestamp };

    if (runner.isFixed) {
        // fixed timestep
        delta = runner.delta;
    } else {
        // dynamic timestep based on wall clock between calls
        delta = (time - runner.timePrev) || runner.delta;
        runner.timePrev = time;

        // optimistically filter delta over a few frames, to improve stability
        runner.deltaHistory.push(delta);
        runner.deltaHistory = runner.deltaHistory.slice(-runner.deltaSampleSize);
        delta = Math.min.apply(null, runner.deltaHistory);

        // limit delta
        delta = delta < runner.deltaMin ? runner.deltaMin : delta;
        delta = delta > runner.deltaMax ? runner.deltaMax : delta;

        // correction for delta
        correction = delta / runner.delta;

        // update engine timing object
        runner.delta = delta;
    }

    // time correction for time scaling
    if (runner.timeScalePrev !== 0)
        correction *= timing.timeScale / runner.timeScalePrev;

    if (timing.timeScale === 0)
        correction = 0;

    runner.timeScalePrev = timing.timeScale;
    runner.correction = correction;

    // fps counter
    runner.frameCounter += 1;
    if (time - runner.counterTimestamp >= 1000) {
        runner.fps = runner.frameCounter * ((time - runner.counterTimestamp) / 1000);
        runner.counterTimestamp = time;
        runner.frameCounter = 0;
    }


    var scene = this.getSceneCurrent();
    scene.update(delta, correction);
    scene.render(this.ctx);
};

se.StarEngine.prototype.run = function(){
    var runner = this.runner;
    var self = this;
    (function render(time){
        runner.frameRequestId = window.requestAnimationFrame(render);
        if (time && runner.enabled)
            self.update(time);
    })();

    return runner;
};

se.StarEngine.prototype.pause = function(status){
    if(status === null)
        status = true;
    this.runner.enabled = !status;
};


