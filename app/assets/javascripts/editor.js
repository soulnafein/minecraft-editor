//= require makeClass
//= require gl-matrix-2
//= require gl
//= require shaderHelper
//= require shaders
//= require scene
//= require webgl-utils
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Program = makeClass();
  var proto = MinecraftEditor.Program.prototype;

  proto.init = function() {
    this.canvas = document.getElementById("lesson01-canvas");
  };

  proto.start = function() {
    GL.init(this.canvas);
    this.initKeyboard();
    this.scene = MinecraftEditor.Scene(this.createShaderProgram());
    this.tick();
  };

  //proto.initKeyboard = function() {
    //document.onkeyup = this.bind(this.handleKeyUp);
  //};

  //proto.handleKeyUp = function(event) {
    //var left = 37;
    //var right = 39;
    //if (event.keyCode === left) {
      //this.blockType -= 1;
      //if (this.blockType<0) {
        //this.blockType = 255;
      //}
    //};

    //if (event.keyCode === right) {
      //this.blockType += 1;
      //if (this.blockType>255) {
        //this.blockType = 0;
      //}
    //};
  //};

  proto.tick = function() {
    requestAnimationFrame(this.bind(this.tick));
    this.scene.render();
    this.scene.animate();
  };

  proto.createShaderProgram = function() {
    var fragmentShader = ShaderHelper.loadFragmentShader(MinecraftEditor.Shaders.fragmentShader);
    var vertexShader = ShaderHelper.loadVertextShader(MinecraftEditor.Shaders.vertexShader);

    var shaders = [fragmentShader, vertexShader];
    var program = ShaderHelper.createProgram(shaders);

    program.vertexPositionAttribute = GL.getAttribLocation(program, "aVertexPosition");
    GL.enableVertexAttribArray(program.vertexPositionAttribute);

    program.vertexNormalAttribute = GL.getAttribLocation(program, "aVertexNormal");
    GL.enableVertexAttribArray(program.vertexNormalAttribute);

    program.textureCoordAttribute = GL.getAttribLocation(program, "aTextureCoord");
    GL.enableVertexAttribArray(program.textureCoordAttribute);

    program.pMatrixUniform = GL.getUniformLocation(program, "uPMatrix");
    program.mvMatrixUniform = GL.getUniformLocation(program, "uMVMatrix");
    program.nMatrixUniform = GL.getUniformLocation(program, "uNMatrix");
    program.samplerUniform = GL.getUniformLocation(program, "uSampler");
    program.ambientColorUniform = GL.getUniformLocation(program, "uAmbientColor");
    program.lightingDirectionUniform = GL.getUniformLocation(program, "uLightingDirection");
    program.directionalColorUniform = GL.getUniformLocation(program, "uDirectionalColor");
    program.textureOffsetX = GL.getUniformLocation(program, "uTextureOffsetX");
    program.textureOffsetY = GL.getUniformLocation(program, "uTextureOffsetY");

    return program;
  };

})();
