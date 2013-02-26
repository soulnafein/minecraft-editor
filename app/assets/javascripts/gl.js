var GL = GL || {};

GL.init = function(canvas) {
  try {
    GL = canvas.getContext("experimental-webgl", {antialias: false});
    GL.viewportWidth = canvas.width;
    GL.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!GL) {
    alert("Could not initialise WebGL, sorry :-(");
  }
};

