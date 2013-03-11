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

    this.pitch = 0;
    this.yaw = 0;

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

  Camera.rotateX = function(pitch) {
    this.pitch += pitch;
    if (this.pitch < -90) {
      this.pitch = -90;
    }
     
    if (this.pitch > 0) {
      this.pitch = 0;
    }
    this.debug();
  };

  Camera.rotateY = function(yaw) {
    this.yaw += yaw;
    if (this.yaw >= 360) {
      this.yaw = 0;
    }
     
    if (this.yaw < 0) {
      this.yaw = 360+(this.yaw);
    }
    this.debug();
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
    var rotation = mat4.create();
    mat4.rotateX(rotation, rotation,  degToRad(this.pitch));
    mat4.rotateY(rotation, rotation, degToRad(this.yaw));

    var transformedPosition = vec3.create();
    vec3.transformMat4(transformedPosition, this.position, rotation);
    mat4.lookAt(this.vMatrix, transformedPosition, this.target, this.up);
  };

  Camera.getPerspectiveMatrix = function() {
    return this.pMatrix;
  };

  Camera.getViewMatrix = function() {
    return this.vMatrix;
  };

  Camera.debug = function() {
    console.log({yaw: this.yaw, pitch: this.pitch});
  }

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
})();

