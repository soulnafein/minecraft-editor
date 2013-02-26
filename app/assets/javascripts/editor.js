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
    // Pyramid
    this.rPyramid = 0;
    this.pyramidVertexPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.pyramidVertexPositionBuffer);
    var vertices = [
      // Front face
      0.0,  1.0,  0.0,
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      // Right face
      0.0,  1.0,  0.0,
      1.0, -1.0,  1.0,
      1.0, -1.0, -1.0,
      // Back face
      0.0,  1.0,  0.0,
      1.0, -1.0, -1.0,
      -1.0, -1.0, -1.0,
      // Left face
      0.0,  1.0,  0.0,
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    this.pyramidVertexPositionBuffer.itemSize = 3;
    this.pyramidVertexPositionBuffer.numItems = 12;

    this.pyramidVertexColorBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.pyramidVertexColorBuffer);
    var colors = [
      // Front face
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      // Right face
      1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      // Back face
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      // Left face
      1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 1.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(colors), GL.STATIC_DRAW);
    this.pyramidVertexColorBuffer.itemSize = 4;
    this.pyramidVertexColorBuffer.numItems = 12;

    // cube
    this.rCube = 0;
    this.cubeVertexPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    vertices = [
      // Front face
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
      1.0,  1.0,  1.0,
      1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0,  1.0,  1.0,
      1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    this.cubeVertexPositionBuffer.itemSize = 3; 
    this.cubeVertexPositionBuffer.numItems = 24;

    this.cubeVertexColorBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexColorBuffer);
    colors = [
      [1.0, 0.0, 0.0, 1.0], // Front face
      [1.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 1.0, 0.0, 1.0], // Top face
      [1.0, 0.5, 0.5, 1.0], // Bottom face
      [1.0, 0.0, 1.0, 1.0], // Right face
      [0.0, 0.0, 1.0, 1.0]  // Left face
    ];
    var unpackedColors = [];
    for (var i in colors) {
      var color = colors[i];
      for (var j=0; j < 4; j++) {
        unpackedColors = unpackedColors.concat(color);
      }
    }
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(unpackedColors), GL.STATIC_DRAW);
    this.cubeVertexColorBuffer.itemSize = 4;
    this.cubeVertexColorBuffer.numItems = 24;

    this.cubeVertexIndexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ];
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), GL.STATIC_DRAW);
    this.cubeVertexIndexBuffer.itemSize = 1;
    this.cubeVertexIndexBuffer.numItems = 36;
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

    mat4.translate(this.mvMatrix, [0.0, 0.0, -1.0]);

    // pyramid
    mat4.translate(this.mvMatrix, [-1.5, 0.0, -7.0]);
    this.mvPushMatrix();
    mat4.rotate(this.mvMatrix, degToRad(this.rPyramid), [0, 1, 0]);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.pyramidVertexPositionBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.pyramidVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.pyramidVertexColorBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.pyramidVertexColorBuffer.itemSize, GL.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    GL.drawArrays(GL.TRIANGLES, 0, this.pyramidVertexPositionBuffer.numItems);
    this.mvPopMatrix();

    // cube
    mat4.translate(this.mvMatrix, [3.0, 0.0, 0.0]);
    this.mvPushMatrix();
    mat4.rotate(this.mvMatrix, degToRad(this.rCube), [1, 1, 1]);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexColorBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    this.setMatrixUniforms();

    GL.drawElements(GL.TRIANGLES, this.cubeVertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);

    this.mvPopMatrix();
  }

  proto.animate = function() {
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
      var elapsed = timeNow - this.lastTime;

      this.rPyramid += (90 * elapsed) / 1000.0;
      this.rCube -= (75 * elapsed) / 1000.0;
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
