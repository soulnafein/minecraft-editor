//= require makeClass
//= require gl-matrix
//= require scene
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Program = makeClass();
  var proto = MinecraftEditor.Program.prototype;

  proto.init = function(canvas) {
  };

  proto.webGLStart = function() {
    var canvas = document.getElementById("lesson01-canvas");
    GL.init(canvas);
    this.initShaders();
    this.initBuffers();

    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.enable(GL.DEPTH_TEST);

    this.drawScene();
  }

  proto.initShaders = function() {
    var fragmentShader = getShader(GL, "shader-fs");
    var vertexShader = getShader(GL, "shader-vs");

    this.shaderProgram = GL.createProgram();
    GL.attachShader(this.shaderProgram, vertexShader);
    GL.attachShader(this.shaderProgram, fragmentShader);
    GL.linkProgram(this.shaderProgram);

    if (!GL.getProgramParameter(this.shaderProgram, GL.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    GL.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = GL.getAttribLocation(this.shaderProgram, "aVertexPosition");
    GL.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.pMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uMVMatrix");
  };

  function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }


  proto.setMatrixUniforms = function() {
    GL.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
    GL.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
  };

  proto.initBuffers = function() {
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

    this.squareVertexPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.squareVertexPositionBuffer);
    vertices = [
      1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
      1.0, -1.0,  0.0,
      -1.0, -1.0,  0.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    this.squareVertexPositionBuffer.itemSize = 3;
    this.squareVertexPositionBuffer.numItems = 4;
  };

  proto.drawScene = function() {
    GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    mat4.perspective(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0, this.pMatrix);

    mat4.identity(this.mvMatrix);

    mat4.translate(this.mvMatrix, [-1.5, 0.0, -7.0]);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    GL.drawArrays(GL.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);


    mat4.translate(this.mvMatrix, [3.0, 0.0, 0.0]);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.squareVertexPositionBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
  }

})();
