//= require makeClass
//= require gl-matrix-2
//= require world
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Scene = makeClass();
  World = MinecraftEditor.World;

  Scene = MinecraftEditor.Scene.prototype;

  Scene.init = function(camera, shaderProgram, shaderProgramPlain) {
    this.blockType = 209;
    this.camera = camera;
    this.shaderProgram = shaderProgram;
    this.shaderProgramPlain = shaderProgramPlain;
    this.world = World();
    
    this.initTextures();
  };

  Scene.render = function() {
    GL.useProgram(this.shaderProgram);
    this.camera.update();
    this.mMatrix = mat4.create();
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    mat4.identity(this.mMatrix);

    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, this.stoneTexture);
    
    this.setupLighting();

    GL.uniform1i(this.shaderProgram.samplerUniform, 0);
    this.setMatrixUniforms();
    this.world.draw(this.shaderProgram);

    GL.useProgram(this.shaderProgramPlain);
    this.setMatrixUniformsPlain();
    this.drawLine();
  };

  Scene.setupLighting = function() {
    GL.uniform3f(this.shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);
    var lightingDirection = [-0.25, -0.25, -1.0];
    var adjustedLD = vec3.create();
    vec3.normalize(adjustedLD, lightingDirection);
    vec3.scale(adjustedLD, adjustedLD, -1);
    GL.uniform3fv(this.shaderProgram.lightingDirectionUniform, adjustedLD);

    GL.uniform3f(this.shaderProgram.directionalColorUniform, 0.8, 0.8, 0.8);
  };

  Scene.setMatrixUniforms = function() {
    GL.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.camera.getPerspectiveMatrix());
    GL.uniformMatrix4fv(this.shaderProgram.mMatrixUniform, false, this.mMatrix);
    GL.uniformMatrix4fv(this.shaderProgram.vMatrixUniform, false, this.camera.getViewMatrix());

    var mvMatrix = mat4.create(); 
    mat4.multiply(mvMatrix, this.mMatrix, this.camera.getViewMatrix());
    var normalMatrix = mat3.clone([mvMatrix[0], mvMatrix[1], mvMatrix[2], mvMatrix[4], mvMatrix[5], mvMatrix[6], mvMatrix[8], mvMatrix[9], mvMatrix[10]]);
    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    GL.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);
  };

  Scene.setMatrixUniformsPlain = function() {
    GL.uniformMatrix4fv(this.shaderProgramPlain.pMatrixUniform, false, this.camera.getPerspectiveMatrix());
    GL.uniformMatrix4fv(this.shaderProgramPlain.mMatrixUniform, false, this.mMatrix);
    GL.uniformMatrix4fv(this.shaderProgramPlain.vMatrixUniform, false, this.camera.getViewMatrix());
  };

  Scene.initTextures = function() {
    var stoneTexture = GL.createTexture();
    stoneTexture.image = new Image();
    stoneTexture.image.onload = function() {
      handleLoadedTexture(stoneTexture);
    }

    stoneTexture.image.src = "/assets/terrain.png";
    this.stoneTexture = stoneTexture;
  }

  Scene.addLine = function(startPoint, endPoint) {
    //this.lineStartPoint = [2, 2, -10];
    //this.lineEndPoint = [4, 4, -3];
    this.lineStartPoint = startPoint;
    this.lineEndPoint = endPoint;
  };

  Scene.drawLine = function() {
    if (this.lineStartPoint && this.lineEndPoint) {
      var lineVertexPositionBuffer = GL.createBuffer();
      GL.bindBuffer(GL.ARRAY_BUFFER, lineVertexPositionBuffer);
      var vertices = [];
      vertices = [
        this.lineStartPoint[0],
        this.lineStartPoint[1],
        this.lineStartPoint[2],
        this.lineEndPoint[0],
        this.lineEndPoint[1],
        this.lineEndPoint[2],
      ];
      GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
      lineVertexPositionBuffer.itemSize = 3; 
      lineVertexPositionBuffer.numItems = vertices.length/3;

      var lineVertexIndexBuffer = GL.createBuffer(); 
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, lineVertexIndexBuffer)
      var indices = [
        0, 1
      ];
      GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), GL.STATIC_DRAW);
      lineVertexIndexBuffer.itemSize = 1;
      lineVertexIndexBuffer.numItems = indices.length;

      GL.bindBuffer(GL.ARRAY_BUFFER, lineVertexPositionBuffer);
      GL.vertexAttribPointer(this.shaderProgramPlain.vertexPositionAttribute, lineVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, lineVertexIndexBuffer);
      GL.drawElements(GL.LINES, lineVertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);
    }
  };

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function handleLoadedTexture(texture) {
    GL.bindTexture(GL.TEXTURE_2D, texture);
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, texture.image);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
    GL.bindTexture(GL.TEXTURE_2D, null);
  }


})();
