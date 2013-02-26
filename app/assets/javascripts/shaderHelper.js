var ShaderHelper = ShaderHelper || {};

(function() {

  ShaderHelper.createProgram = function(shaders) {
    var program = GL.createProgram();
    for(var i = 0; i < shaders.length; ++i) {
      GL.attachShader(program, shaders[i]);
    }
    GL.linkProgram(program);

    if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
      console.log("Could not initialise shaders program");
    }

    GL.useProgram(program);
    return program;
  };

  ShaderHelper.loadVertextShader = function(source) {
    return loadShader(source, GL.VERTEX_SHADER);
  };

  ShaderHelper.loadFragmentShader = function(source) {
    return loadShader(source, GL.FRAGMENT_SHADER);
  };

  function loadShader(source, type) {
    var shader = GL.createShader(type);

    GL.shaderSource(shader, source);
    GL.compileShader(shader);

    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      console.log(GL.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }
})();
