//= require makeClass
//= require block
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Chunk = makeClass();
  var Chunk = MinecraftEditor.Chunk.prototype;

  Chunk.init = function() {
    this.blocks = [];
    var block = MinecraftEditor.Block(0, 0, 0, "grass");
    this.blocks.push(block);
    var block = MinecraftEditor.Block(2, 0, 2, "grass");
    this.blocks.push(block);
    var block = MinecraftEditor.Block(-4, 0, 3, "wood");
    this.blocks.push(block);
    var block = MinecraftEditor.Block(-4, 2, 3, "stone");
    this.blocks.push(block);
    var block = MinecraftEditor.Block(-2, 0, 0, "wood");
    this.blocks.push(block);
    this.xRot = 0;
    this.yRot = 0;
    this.zRot = 0;
    this.needsBuffersRegeneration = true;
  };

  Chunk.regenerateBuffers = function() {
    this.cubeVertexPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    var vertices = [];
    
    for(var i=0; i<this.blocks.length; ++i) {
      vertices = vertices.concat(this.blocks[i].vertices);
    }
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    this.cubeVertexPositionBuffer.itemSize = 3; 
    this.cubeVertexPositionBuffer.numItems = vertices.length/3;

    this.cubeVertexNormalBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    var vertexNormals = [];
    for(var i=0; i<this.blocks.length; ++i) {
      vertexNormals = vertexNormals.concat(this.blocks[i].normals);
    }
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertexNormals), GL.STATIC_DRAW);
    this.cubeVertexNormalBuffer.itemSize = 3;
    this.cubeVertexNormalBuffer.numItems = vertexNormals.length/3;

    this.cubeVertexTextureCoordBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    var textureCoords = [];
    for(var i=0; i<this.blocks.length; ++i) {
      textureCoords = textureCoords.concat(this.blocks[i].textureCoords);
    }
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(textureCoords), GL.STATIC_DRAW);
    this.cubeVertexTextureCoordBuffer.itemSize = 2;
    this.cubeVertexTextureCoordBuffer.numItems = textureCoords.length/2;

    this.cubeVertexTextureOffsetBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cubeVertexTextureOffsetBuffer);
    var textureOffsets = [];
    for(var i=0; i<this.blocks.length; ++i) {
      textureOffsets = textureOffsets.concat(this.blocks[i].textureOffsets);
    }
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(textureOffsets), GL.STATIC_DRAW);
    this.cubeVertexTextureOffsetBuffer.itemSize = 2;
    this.cubeVertexTextureOffsetBuffer.numItems = textureOffsets.length/2;

    this.cubeVertexIndexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    var cubeVertexIndices = [];
    for(var i=0; i<this.blocks.length; ++i) {
      cubeVertexIndices = cubeVertexIndices.concat(this.blocks[i].getIndices(i));     
    }
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), GL.STATIC_DRAW);
    this.cubeVertexIndexBuffer.itemSize = 1;
    this.cubeVertexIndexBuffer.numItems = cubeVertexIndices.length;


    
    // code for buffers
    this.needsBuffersRegeneration = false;
  };

  Chunk.draw = function(shaderProgram) {
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

