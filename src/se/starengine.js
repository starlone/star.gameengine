/* global se:true */
/* global window:true */
/* eslint no-undef: 'error' */

/*
  Star Engine
*/
se.StarEngine = function (elementID) {
  this.elementID = elementID;

  this.scenes = [];
  this.joystick = new se.Joystick();

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

se.StarEngine.prototype.getSceneCurrent = function () {
  return this.scenes[0];
};

se.StarEngine.prototype.getContext = function () {
  return this.viewport.getContext();
};

se.StarEngine.prototype.addScene = function (scene) {
  this.scenes.push(scene);
  scene.setParent(this);
};

se.StarEngine.prototype.update = function (time) {
  var runner = this.runner;

  var timing = runner.timing;
  var correction = 1;
  var delta;

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
  if (runner.timeScalePrev !== 0) {
    correction *= timing.timeScale / runner.timeScalePrev;
  }

  if (timing.timeScale === 0) {
    correction = 0;
  }

  runner.timeScalePrev = timing.timeScale;
  runner.correction = correction;

  // fps counter
  runner.frameCounter += 1;
  if (time - runner.counterTimestamp >= 1000) {
    runner.fps = runner.frameCounter * ((time - runner.counterTimestamp) / 1000);
    runner.counterTimestamp = time;
    runner.frameCounter = 0;
  }
};

se.StarEngine.prototype.run = function () {
  var runner = this.runner;
  var self = this;
  this.viewport = new se.ViewPort(this.elementID);
  (function render(time) {
    runner.frameRequestId = window.requestAnimationFrame(render);
    var scene = self.getSceneCurrent();
    if (time) {
      self.update(time);
      if (runner.enabled) {
        scene.update(runner.delta, runner.correction);
      }
    }
    if (self.viewport) {
      self.viewport.render(scene);
    }
  })();

  return runner;
};

se.StarEngine.prototype.pause = function (status) {
  if (status === undefined) {
    status = true;
  }
  this.runner.enabled = !status;
};
