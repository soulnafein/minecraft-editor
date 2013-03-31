//= require makeClass
//= require gl-matrix-2
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Camera = makeClass();
  var Camera = MinecraftEditor.Camera.prototype;

  Camera.init = function(viewportWidth, viewportHeight) {
    this.up = vec3.fromValues(0,1,0);
    this.target = vec3.fromValues(0,1,-1);
    this.position = vec3.fromValues(0,1,0);

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
    console.log(position);
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

    this.transformedPosition = transformedPosition;
    mat4.lookAt(this.viewMatrix, transformedPosition, transformedTarget, this.up);
  };

  Camera.getPerspectiveMatrix = function() {
    return this.projectionMatrix;
  };

  Camera.getViewMatrix = function() {
    return this.viewMatrix;
  };

  Camera.getViewProjectionInverse = function() {
    var viewProjection = mat4.create();
    mat4.multiply(viewProjection, this.projectionMatrix, this.viewMatrix);
    var viewProjectionInverse = mat4.create();
    mat4.invert(viewProjectionInverse, viewProjection);
    return viewProjectionInverse;
  };

  Camera.convertCoords = function (clientX, clientY) {
    var x = 2.0*clientX/this.viewportWidth - 1.0;
    var y = -2.0*clientY/this.viewportHeight + 1.0;

    return [x, y]
  };

  Camera.toWorldCoords = function(clientX, clientY, clientZ) {
    var coords = this.convertCoords(clientX, clientY);
    var vec = vec4.fromValues(coords[0], coords[1], clientZ, 1);
    vec4.transformMat4(vec, vec, this.getViewProjectionInverse());

    var result = [vec[0]/vec[3], 
                  vec[1]/vec[3],
                  vec[2]/vec[3]];
    console.log(result);

    return result;
  };

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
})();

