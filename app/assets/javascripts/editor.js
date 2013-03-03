//= require makeClass
//= require gl-matrix-2
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
    this.blockType = 209;
    this.initKeyboard();
    this.initShaders();
    this.initBuffers();
    this.initTextures();
    this.tick();
  };

  proto.initKeyboard = function() {
    document.onkeyup = this.bind(this.handleKeyUp);
  };

  proto.handleKeyUp = function(event) {
    var left = 37;
    var right = 39;
    if (event.keyCode === left) {
      this.blockType -= 1;
      if (this.blockType<0) {
        this.blockType = 255;
      }
    };

    if (event.keyCode === right) {
      this.blockType += 1;
      if (this.blockType>255) {
        this.blockType = 0;
      }
    };
  };

  proto.tick = function() {
    requestAnimationFrame(this.bind(this.tick));
    this.drawScene();
    this.animate();
  };

  proto.initTextures = function() {
    var stoneTexture = GL.createTexture();
    stoneTexture.image = new Image();
    stoneTexture.image.onload = function() {
      handleLoadedTexture(stoneTexture);
    }

    stoneTexture.image.src = "/assets/terrain.png";
    this.stoneTexture = stoneTexture;
  }

  function handleLoadedTexture(texture) {
    GL.bindTexture(GL.TEXTURE_2D, texture);
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, texture.image);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
    GL.bindTexture(GL.TEXTURE_2D, null);
  }

  proto.initShaders = function() {
    var fragmentShader = ShaderHelper.loadFragmentShader(MinecraftEditor.Shaders.fragmentShader);
    var vertexShader = ShaderHelper.loadVertextShader(MinecraftEditor.Shaders.vertexShader);

    var shaders = [fragmentShader, vertexShader];
    this.shaderProgram = ShaderHelper.createProgram(shaders);

    this.shaderProgram.vertexPositionAttribute = GL.getAttribLocation(this.shaderProgram, "aVertexPosition");
    GL.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.vertexNormalAttribute = GL.getAttribLocation(this.shaderProgram, "aVertexNormal");
    GL.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);

    this.shaderProgram.textureCoordAttribute = GL.getAttribLocation(this.shaderProgram, "aTextureCoord");
    GL.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

    this.shaderProgram.pMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.shaderProgram.nMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uNMatrix");
    this.shaderProgram.samplerUniform = GL.getUniformLocation(this.shaderProgram, "uSampler");
    this.shaderProgram.ambientColorUniform = GL.getUniformLocation(this.shaderProgram, "uAmbientColor");
    this.shaderProgram.lightingDirectionUniform = GL.getUniformLocation(this.shaderProgram, "uLightingDirection");
    this.shaderProgram.directionalColorUniform = GL.getUniformLocation(this.shaderProgram, "uDirectionalColor");
    this.shaderProgram.textureOffsetX = GL.getUniformLocation(this.shaderProgram, "uTextureOffsetX");
    this.shaderProgram.textureOffsetY = GL.getUniformLocation(this.shaderProgram, "uTextureOffsetY");
  };

  proto.setMatrixUniforms = function() {
    GL.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
    GL.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    var normalMatrix = mat3.clone([this.mvMatrix[0], this.mvMatrix[1], this.mvMatrix[2], this.mvMatrix[4], this.mvMatrix[5], this.mvMatrix[6], this.mvMatrix[8], this.mvMatrix[9], this.mvMatrix[10]]);
    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    GL.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);
  };

  proto.setTextureOffsetUniforms = function() {
    var blockSize = 1.0/16;
    var xOffset = this.blockType % 16 * blockSize;
    GL.uniform1f(this.shaderProgram.textureOffsetX, xOffset);

    var yOffset = ((this.blockType/16)|(this.blockType/16)) * blockSize;
    GL.uniform1f(this.shaderProgram.textureOffsetY, yOffset);
  };

  proto.initBuffers = function() {
    // cube
    this.xRot = 0;
    this.yRot = 0;
    this.zRot = 0;
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

    this.cubeVertexNormalBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    var vertexNormals = [
      // Front face
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,

      // Back face
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,

      // Top face
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,

      // Bottom face
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,

      // Right face
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,

      // Left face
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertexNormals), GL.STATIC_DRAW);
    this.cubeVertexNormalBuffer.itemSize = 3;
    this.cubeVertexNormalBuffer.numItems = 24;

    this.cubeVertexTextureCoordBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);

    var blockSize = 1.0/16;

    var textureCoords = [
      // Front face
      0.0, 0.0, 
      blockSize, 0.0,
      blockSize, blockSize,
      0.0, blockSize,

      // Back face
      blockSize, 0.0, 
      blockSize, blockSize,
      0.0, blockSize,
      0.0, 0.0,

      // Top face
      0.0, blockSize,
      0.0, 0.0,
      blockSize, 0.0,
      blockSize, blockSize,

      // Bottom face
      blockSize, blockSize,
      0.0, blockSize,
      0.0, 0.0,
      blockSize, 0.0,

      // Right face
      blockSize, 0.0,
      blockSize, blockSize,
      0.0, blockSize,
      0.0, 0.0,

      // Left face
      0.0, 0.0,
      blockSize, 0.0,
      blockSize, blockSize,
      0.0, blockSize,
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(textureCoords), GL.STATIC_DRAW);
    this.cubeVertexTextureCoordBuffer.itemSize = 2;
    this.cubeVertexTextureCoordBuffer.numItems = 24;


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

    mat4.perspective(this.pMatrix, 45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);

    mat4.identity(this.mvMatrix);

    mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, 0.0, -10.0]);

    // cube
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(this.xRot), [1, 0, 0]);
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(this.yRot), [0, 1, 0]);
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(this.zRot), [0, 0, 1]);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    GL.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, this.stoneTexture);

    GL.uniform3f(this.shaderProgram.ambientColorUniform, 0.1, 0.1, 0.1);

    var lightingDirection = [-0.25, -0.25, -1.0];
    var adjustedLD = vec3.create();
    vec3.normalize(adjustedLD, lightingDirection);
    vec3.scale(adjustedLD, adjustedLD, -1);
    GL.uniform3fv(this.shaderProgram.lightingDirectionUniform, adjustedLD);

    GL.uniform3f(this.shaderProgram.directionalColorUniform, 0.8, 0.8, 0.8);

    GL.uniform1i(this.shaderProgram.samplerUniform, 0);
    this.setTextureOffsetUniforms();


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    this.setMatrixUniforms();
    GL.drawElements(GL.TRIANGLES, this.cubeVertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);
  }

  proto.animate = function() {
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
      var elapsed = timeNow - this.lastTime;

      this.xRot += (90 * elapsed) / 1000.0;
      this.yRot += (90 * elapsed) / 1000.0;
      this.zRot += (90 * elapsed) / 1000.0;
    }
    this.lastTime = timeNow;
  };

  proto.mvPushMatrix = function() {
    var copy = mat4.clone(this.mvMatrix);
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
