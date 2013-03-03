var GL = GL || {};

GL.init = function(canvas) {
  try {
    GL = canvas.getContext("experimental-webgl", {antialias: false});
    GL.viewportWidth = document.width;
    GL.viewportHeight = document.height;
  } catch (e) {
  }
  if (!GL) {
    alert("Could not initialise WebGL, sorry :-(");
  }
};

