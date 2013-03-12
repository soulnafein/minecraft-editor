//= require makeClass
//= require gl-matrix-2
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Camera = makeClass();
  var Camera = MinecraftEditor.Camera.prototype;

  Camera.init = function(viewportWidth, viewportHeight) {
    this.up = vec3.fromValues(0,1,0);
    this.target = vec3.fromValues(0,0,0);
    this.position = vec3.fromValues(0,0,-1);

    this.zoomFactor = 0;

    this.rotation = quat.create();
    this.pitch = 0;

    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    GL.enable(GL.DEPTH_TEST);
    this.resizeViewport(viewportWidth, viewportHeight);
  };

  Camera.resizeViewport = function(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    GL.viewport(0, 0, viewportWidth, viewportHeight);
    mat4.perspective(this.projectionMatrix, 45, viewportWidth/viewportHeight, 0.1, 100.0);
  };

  Camera.panX = function(x) {
    var vector = vec3.fromValues(x, 0, 0);
    vec3.add(this.position, this.position, vector);
    vec3.add(this.target, this.target, vector);
  };

  Camera.panY = function(y) {
    var vector = vec3.fromValues(0, y, 0);
    vec3.add(this.position, this.position, vector);
    vec3.add(this.target, this.target, vector);
  };

  Camera.zoom = function(factor) {
    this.zoomFactor += factor;
  };

  Camera.rotateX = function(pitch) {
    this.pitch += pitch;
    if (this.pitch < -90) {
      this.pitch = -89.999;
    }
     
    if (this.pitch > 0) {
      this.pitch = 0;
    }
  };

  Camera.rotateY = function(yaw) {
    quat.rotateY(this.rotation, this.rotation, degToRad(yaw));
    quat.normalize(this.rotation, this.rotation);
  };

  Camera.moveTo = function(position) {
    this.position = position;
  };

  Camera.lookAt = function(target) {
    this.target = target;    
  };

  Camera.update = function() {
    var rotation = quat.create();
    quat.rotateX(rotation, this.rotation,  degToRad(this.pitch));

    var transformedPosition = vec3.create();
    vec3.transformQuat(transformedPosition, this.position, rotation);
    vec3.add(transformedPosition, transformedPosition, [0, 0, this.zoomFactor]);

    var transformedTarget = vec3.create();
    vec3.transformQuat(transformedTarget, this.target, rotation);
    vec3.add(transformedTarget, transformedTarget, [0, 0, this.zoomFactor]);

    mat4.lookAt(this.viewMatrix, transformedPosition, transformedTarget, this.up);
  };

  Camera.getPerspectiveMatrix = function() {
    return this.projectionMatrix;
  };

  Camera.getViewMatrix = function() {
    return this.viewMatrix;
  };

  Camera.convertCoords = function (clientX, clientY) {
    var x = 1.0*clientX/this.viewportWidth*2 - 1.0;
    var y = -1.0 * (1.0*clientY/this.viewportHeight*2 - 1.0);

    return [x, y]
  };

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
})();

