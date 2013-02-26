window.MinecraftEditor = window.MinecraftEditor || {}
window.MinecraftEditor.Shaders = MinecraftEditor.Shaders || {}

MinecraftEditor.Shaders.vertexShader = """
  attribute vec3 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  varying vec4 vColor;

  void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
  }
"""

MinecraftEditor.Shaders.fragmentShader = """
  precision mediump float;

  varying vec4 vColor;

  void main(void) {
      gl_FragColor = vColor;
  }
"""

