//= require makeClass 
//= require block
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.World = makeClass();
  var World = MinecraftEditor.World.prototype;

  WORLD_SIZE = 64;

  World.init = function() {
    this.blocks = [];
    for(var x = -(WORLD_SIZE/2); x < (WORLD_SIZE/2); x+=2) {
      for(var z = -(WORLD_SIZE/2); z < (WORLD_SIZE/2); z+=2) {
        this.addBlock(x, 0, z, "grass");
      }
    }

    this.addBlock(4, 2, 3, "stone");
    this.addBlock(4, 4, 3, "wood");
    this.addBlock(2, 2, 0, "stone");
    this.xRot = 0;
    this.yRot = 0;
    this.zRot = 0;
    this.needsBuffersRegeneration = true;
  };

  World.addBlock = function(x, y, z, type) {
    var block = MinecraftEditor.Block(x, y, z, type);
    this.blocks.push(block);
    this.needsBuffersRegeneration = true;
  };

  World.regenerateBuffers = function() {
    this.cubeVertexPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    var vertices = [];
    
    this.blocks.forEach(function(block) {
      vertices = vertices.concat(block.vertices);
    });
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    this.cubeVertexPositionBuffer.itemSize = 3; 
    this.cubeVertexPositionBuffer.numItems = vertices.length/3;

    this.cubeVertexNormalBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    var vertexNormals = [];
    this.blocks.forEach(function(block) {
      vertexNormals = vertexNormals.concat(block.normals);
    });
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertexNormals), GL.STATIC_DRAW);
    this.cubeVertexNormalBuffer.itemSize = 3;
    this.cubeVertexNormalBuffer.numItems = vertexNormals.length/3;

    this.cubeVertexTextureCoordBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    var textureCoords = [];
    this.blocks.forEach(function(block) {
      textureCoords = textureCoords.concat(block.textureCoords);
    });
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(textureCoords), GL.STATIC_DRAW);
    this.cubeVertexTextureCoordBuffer.itemSize = 2;
    this.cubeVertexTextureCoordBuffer.numItems = textureCoords.length/2;

    this.cubeVertexTextureOffsetBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexTextureOffsetBuffer);
    var textureOffsets = [];
    this.blocks.forEach(function(block) {
      textureOffsets = textureOffsets.concat(block.textureOffsets);
    });
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(textureOffsets), GL.STATIC_DRAW);
    this.cubeVertexTextureOffsetBuffer.itemSize = 2;
    this.cubeVertexTextureOffsetBuffer.numItems = textureOffsets.length/2;

    this.cubeVertexIndexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    var cubeVertexIndices = [];
    var i = 0;
    this.blocks.forEach(function(block) {
      cubeVertexIndices = cubeVertexIndices.concat(block.getIndices(i));     
      i+=1;
    });
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), GL.STATIC_DRAW);
    this.cubeVertexIndexBuffer.itemSize = 1;
    this.cubeVertexIndexBuffer.numItems = cubeVertexIndices.length;


    
    // code for buffers
    this.needsBuffersRegeneration = false;
  };

  World.draw = function(shaderProgram) {
    if (this.needsBuffersRegeneration) {
      this.regenerateBuffers();
    }
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    GL.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    GL.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    GL.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexTextureOffsetBuffer);
    GL.vertexAttribPointer(shaderProgram.textureOffsetsAttribute, this.cubeVertexTextureOffsetBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    GL.drawElements(GL.TRIANGLES, this.cubeVertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);
  };

})();

