//= require makeClass
//= require gl-matrix-2
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Camera = makeClass();
  var Camera = MinecraftEditor.Camera.prototype;

  Camera.init = function(viewportWidth, viewportHeight) {
    this.pMatrix = mat4.create();
    GL.enable(GL.DEPTH_TEST);
    this.resizeViewport(viewportWidth, viewportHeight);
  };

  Camera.resizeViewport = function(viewportWidth, viewportHeight) {
    GL.viewport(0, 0, viewportWidth, viewportHeight);
    mat4.perspective(this.pMatrix, 45, viewportWidth/viewportHeight, 0.1, 100.0);
  };

  Camera.getPerspectiveMatrix = function() {
    return this.pMatrix;
  };
})();

