//= require makeClass
//= require gl-matrix-2
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Scene = makeClass();
  var Scene = MinecraftEditor.Scene.prototype;

  Scene.init = function(camera, shaderProgram, chunk, 
                        arcballControl) {
    this.blockType = 209;
    this.lastTime = 0;
    this.camera = camera;
    this.arcballControl = arcballControl;
    this.camera.moveTo([0.0, 0.0, 10.0]);
    this.camera.lookAt([0, 0, 0]);
    this.shaderProgram = shaderProgram;
    this.chunk = chunk;
    this.initTextures();
  };

  Scene.animate = function() {
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
      var elapsed = timeNow - this.lastTime;
      this.arcballControl.update(elapsed)

      //this.chunk.xRot += (90 * elapsed) / 1000.0;
      //this.chunk.yRot += (90 * elapsed) / 1000.0;
      //this.chunk.zRot += (90 * elapsed) / 1000.0;
    }
    this.lastTime = timeNow;
  };

  Scene.render = function() {
    this.camera.update();
    this.mMatrix = mat4.create();
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    mat4.identity(this.mMatrix);

    var chunk = this.chunk;

    if (chunk.needsBuffersRegeneration) {
      chunk.regenerateBuffers();
    }
    // cube
    mat4.rotate(this.mMatrix, this.mMatrix, degToRad(chunk.yRot), [0, 1, 0]);
    mat4.rotate(this.mMatrix, this.mMatrix, degToRad(chunk.yRot), [0, 1, 0]);
    mat4.rotate(this.mMatrix, this.mMatrix, degToRad(chunk.zRot), [0, 0, 1]);

    GL.bindBuffer(GL.ARRAY_BUFFER, chunk.cubeVertexPositionBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, chunk.cubeVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, chunk.cubeVertexNormalBuffer);
    GL.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, chunk.cubeVertexNormalBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, chunk.cubeVertexTextureCoordBuffer);
    GL.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, chunk.cubeVertexTextureCoordBuffer.itemSize, GL.FLOAT, false, 0, 0);

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


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, chunk.cubeVertexIndexBuffer);
    this.setMatrixUniforms();
    GL.drawElements(GL.TRIANGLES, chunk.cubeVertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);
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

  Scene.setTextureOffsetUniforms = function() {
    var blockSize = 1.0/16;
    var xOffset = this.blockType % 16 * blockSize;
    GL.uniform1f(this.shaderProgram.textureOffsetX, xOffset);

    var yOffset = ((this.blockType/16)|(this.blockType/16)) * blockSize;
    GL.uniform1f(this.shaderProgram.textureOffsetY, yOffset);
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
