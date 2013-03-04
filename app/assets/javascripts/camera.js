//= require makeClass
//= require gl-matrix-2
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Camera = makeClass();
  var Camera = MinecraftEditor.Camera.prototype;

  Camera.init = function(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.pMatrix = mat4.create();
    GL.enable(GL.DEPTH_TEST);
    this.resizeViewport(viewportWidth, viewportHeight);
  };

  Camera.resizeViewport = function(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    GL.viewport(0, 0, viewportWidth, viewportHeight);
    mat4.perspective(this.pMatrix, 45, viewportWidth/viewportHeight, 0.1, 100.0);
  };

  Camera.moveTo = function(position) {
    mat4.identity(this.pMatrix);
    this.resizeViewport(this.viewportWidth, this.viewportHeight);
    mat4.translate(this.pMatrix, this.pMatrix, position);
  };

  Camera.lookAt = function(target) {
  };

  Camera.getPerspectiveMatrix = function() {
    return this.pMatrix;
  };

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
})();

