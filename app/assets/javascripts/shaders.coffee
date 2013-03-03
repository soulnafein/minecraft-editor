window.MinecraftEditor = window.MinecraftEditor || {}
window.MinecraftEditor.Shaders = MinecraftEditor.Shaders || {}

MinecraftEditor.Shaders.vertexShader = """
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;

  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat3 uNMatrix;

  uniform vec3 uAmbientColor;

  uniform vec3 uLightingDirection;
  uniform vec3 uDirectionalColor;

  varying vec2 vTextureCoord;
  varying vec3 vLightWeighting;

  void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;

    vec3 transformedNormal = uNMatrix * aVertexNormal;
    float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
    vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
  }
"""

MinecraftEditor.Shaders.fragmentShader = """
  #ifdef GL_ES
    precision highp float;
  #endif

  varying vec2 vTextureCoord;
  varying vec3 vLightWeighting;

  uniform sampler2D uSampler;
  uniform float uTextureOffsetX;
  uniform float uTextureOffsetY;

  void main(void) {
    vec4 textureColor = texture2D(uSampler, vec2(uTextureOffsetX + vTextureCoord.s, uTextureOffsetY + vTextureCoord.t));
    gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
  }
"""

