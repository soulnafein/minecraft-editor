//= require makeClass
//= require gl-matrix
//= require gl
//= require shaderHelper
//= require shaders
//= require webgl-utils
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Program = makeClass();
  var proto = MinecraftEditor.Program.prototype;

  proto.init = function() {
    this.lastTime = 0;
    this.mvMatrixStack = [];
    this.canvas = document.getElementById("lesson01-canvas");
  };

  proto.start = function() {
    GL.init(this.canvas);
    this.initShaders();
    this.initBuffers();
    this.tick();
  };

  proto.tick = function() {
    requestAnimationFrame(this.bind(this.tick));
    this.drawScene();
    this.animate();
  };

  proto.initShaders = function() {
    var fragmentShader = ShaderHelper.loadFragmentShader(MinecraftEditor.Shaders.fragmentShader);
    var vertexShader = ShaderHelper.loadVertextShader(MinecraftEditor.Shaders.vertexShader);

    var shaders = [fragmentShader, vertexShader];
    this.shaderProgram = ShaderHelper.createProgram(shaders);

    this.shaderProgram.vertexPositionAttribute = GL.getAttribLocation(this.shaderProgram, "aVertexPosition");
    GL.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.vertexColorAttribute = GL.getAttribLocation(this.shaderProgram, "aVertexColor");
    GL.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

    this.shaderProgram.pMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uMVMatrix");
  };

  proto.setMatrixUniforms = function() {
    GL.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
    GL.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
  };

  proto.initBuffers = function() {
    // Triangle
    this.rTri = 0;
    this.triangleVertexPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    var vertices = [
      0.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
      1.0, -1.0,  0.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    this.triangleVertexPositionBuffer.itemSize = 3;
    this.triangleVertexPositionBuffer.numItems = 3;

    this.triangleVertexColorBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(colors), GL.STATIC_DRAW);
    this.triangleVertexColorBuffer.itemSize = 4;
    this.triangleVertexColorBuffer.numItems = 3;

    // Square
    this.rSquare = 0;
    this.squareVertexPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.squareVertexPositionBuffer);
    vertices = [
      1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
      1.0, -1.0,  0.0,
      -1.0, -1.0,  0.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    this.squareVertexPositionBuffer.itemSize = 3; this.squareVertexPositionBuffer.numItems = 4;

    this.squareVertexColorBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.squareVertexColorBuffer);
    var colors = []
    for (var i=0; i < 4; i++) {
      colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
    }
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(colors), GL.STATIC_DRAW);
    this.squareVertexColorBuffer.itemSize = 4;
    this.squareVertexColorBuffer.numItems = 4;
  };

  proto.drawScene = function() {
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.enable(GL.DEPTH_TEST);
    GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    mat4.perspective(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0, this.pMatrix);

    mat4.identity(this.mvMatrix);

    // triangle
    mat4.translate(this.mvMatrix, [-1.5, 0.0, -7.0]);
    this.mvPushMatrix();
    mat4.rotate(this.mvMatrix, degToRad(this.rTri), [0, 1, 0]);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, GL.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    GL.drawArrays(GL.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);

    this.mvPopMatrix();

    // square
    mat4.translate(this.mvMatrix, [3.0, 0.0, 0.0]);
    this.mvPushMatrix();
    mat4.rotate(this.mvMatrix, degToRad(this.rSquare), [1, 0, 0]);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.squareVertexPositionBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.squareVertexColorBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.squareVertexColorBuffer.itemSize, GL.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
    this.mvPopMatrix();
  }

  proto.animate = function() {
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
      var elapsed = timeNow - this.lastTime;

      this.rTri += (90 * elapsed) / 1000.0;
      this.rSquare += (75 * elapsed) / 1000.0;
    }
    this.lastTime = timeNow;
  };

  proto.mvPushMatrix = function() {
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
  };

  proto.mvPopMatrix = function() {
    if (this.mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    this.mvMatrix = this.mvMatrixStack.pop();
  };

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
})();
