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
    this.vMatrix = mat4.create();
    GL.enable(GL.DEPTH_TEST);
    this.resizeViewport(viewportWidth, viewportHeight);
    window.document.addEventListener('mouseup', this.bind( this.mouseup ), false);
  };

  Camera.mouseup = function(event) {
    console.log(event.clientX, event.clientY);
  };

  Camera.resizeViewport = function(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    GL.viewport(0, 0, viewportWidth, viewportHeight);
    mat4.perspective(this.pMatrix, 45, viewportWidth/viewportHeight, 0.1, 100.0);
  };

  Camera.moveTo = function(position) {
    mat4.identity(this.vMatrix);
    mat4.translate(this.vMatrix, this.vMatrix, position);
  };

  Camera.lookAt = function(target) {
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

