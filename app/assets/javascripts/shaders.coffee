window.MinecraftEditor = window.MinecraftEditor || {}
window.MinecraftEditor.Shaders = MinecraftEditor.Shaders || {}

MinecraftEditor.Shaders.vertexShader = """
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  varying vec2 vTextureCoord;

  void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
  }
"""

MinecraftEditor.Shaders.fragmentShader = """
  precision mediump float;

  varying vec2 vTextureCoord;

  uniform sampler2D uSampler;
  uniform float uTextureOffsetX;
  uniform float uTextureOffsetY;

  void main(void) {
      gl_FragColor = texture2D(uSampler, vec2(uTextureOffsetX + vTextureCoord.s, uTextureOffsetY + vTextureCoord.t));
  }
"""

