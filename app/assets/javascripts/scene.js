//= require makeClass
//= require gl-matrix
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Scene = makeClass();
  var Scene = MinecraftEditor.Scene.prototype;

  Scene.init = function(canvas) {
  };
})();

var GL = GL || {};

GL.init = function(canvas) {
  try {
    GL = canvas.getContext("experimental-webgl");
    GL.viewportWidth = canvas.width;
    GL.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!GL) {
    alert("Could not initialise WebGL, sorry :-(");
  }
};
