//= require makeClass
//= require gl-matrix-2
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Camera = makeClass();
  var Camera = MinecraftEditor.Camera.prototype;

  Camera.init = function(viewportWidth, viewportHeight) {
    this.up = vec3.fromValues(0,1,0);
    this.target = vec3.fromValues(0,0,-1);
    this.position = vec3.fromValues(0,0,0);
    this.rotation = quat.create();

    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.pMatrix = mat4.create();
    this.vMatrix = mat4.create();
    GL.enable(GL.DEPTH_TEST);
    this.resizeViewport(viewportWidth, viewportHeight);
  };

  Camera.resizeViewport = function(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    GL.viewport(0, 0, viewportWidth, viewportHeight);
    mat4.perspective(this.pMatrix, 45, viewportWidth/viewportHeight, 0.1, 100.0);
  };

  Camera.rotateWithQuaternion = function(quaternion) {
    quat.normalize(quaternion, quaternion);
    //quat.invert(quaternion, quaternion);
    vec3.transformQuat(this.position, this.position, quaternion);
    vec3.transformQuat(this.up, this.up, quaternion);
    vec3.transformQuat(this.target, this.target, quaternion);
  };

  Camera.moveTo = function(position) {
    this.position = position;
    console.log(position);
    //mat4.translate(this.vMatrix, this.vMatrix, position);
  };

  Camera.lookAt = function(target) {
    this.target = target;    
  };

  Camera.update = function() {
    mat4.lookAt(this.vMatrix, this.position, this.target, this.up);
  };

  Camera.getPerspectiveMatrix = function() {
    return this.pMatrix;
  };

  Camera.getViewMatrix = function() {
    return this.vMatrix;
  };

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
})();

