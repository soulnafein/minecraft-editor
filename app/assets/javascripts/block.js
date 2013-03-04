//= require makeClass
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Block = makeClass();
  var Block = MinecraftEditor.Block.prototype;

  Block.init = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vertices = this.calculateVertices();
    this.normals = this.calculateNormals();
    this.textureCoords = this.calculateTextureCoords();
  };

  Block.calculateVertices = function() {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    return [
      // Front face
      x-1.0, y-1.0,  z+1.0,
      x+1.0, y-1.0,  z+1.0,
      x+1.0,  y+1.0,  z+1.0,
      x-1.0,  y+1.0,  z+1.0,

      // Back face
      x-1.0, y-1.0, z-1.0,
      x-1.0,  y+1.0, z-1.0,
      x+1.0,  y+1.0, z-1.0,
      x+1.0, y-1.0, z-1.0,

      // Top face
      x-1.0,  y+1.0, z-1.0,
      x-1.0,  y+1.0,  z+1.0,
      x+1.0,  y+1.0,  z+1.0,
      x+1.0,  y+1.0, z-1.0,

      // Bottom face
      x-1.0, y-1.0, z-1.0,
      x+1.0, y-1.0, z-1.0,
      x+1.0, y-1.0,  z+1.0,
      x-1.0, y-1.0,  z+1.0,

      // Right face
      x+1.0, y-1.0, z-1.0,
      x+1.0, y+1.0, z-1.0,
      x+1.0, y+1.0,  z+1.0,
      x+1.0, y-1.0, z+1.0,

      // Left face
      x-1.0, y-1.0, z-1.0,
      x-1.0, y-1.0,  z+1.0,
      x-1.0,  y+1.0,  z+1.0,
      x-1.0,  y+1.0, z-1.0,
    ];
  };

  Block.calculateNormals = function() {
    return [
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
  };

  Block.calculateTextureCoords = function() {
    var blockSize = 1.0/16;
    return [
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
  };

  Block.getIndices = function(index) {
    var indices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ];

    var adjustedIndices = [];

    for(var i=0; i<indices.length; ++i) {
      adjustedIndices.push(indices[i]+(index*24));
    }

    return adjustedIndices;
  }
})();
