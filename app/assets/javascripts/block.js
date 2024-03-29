//= require makeClass
var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.Block = makeClass();
  var Block = MinecraftEditor.Block.prototype;

  BLOCK_TYPES = {
    "grass" : [98, 243],
    "stone" : [241, 241],
    "wood" : [229, 228]
  }

  Block.init = function(x, y, z, type) {
    var start = new Date().getTime();
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = type;
    this.vertices = this.calculateVertices();
    this.normals = this.calculateNormals();
    this.textureCoords = this.calculateTextureCoords();
    this.textureOffsets = this.calculateTextureOffsets();
    this.id = this.calculateId();
    var end = new Date().getTime();
    var time = end-start;
    console.log("Created block [" + x + ", " + y + ", " + z + "] in " + time + "ms");
  };

  Block.calculateVertices = function() {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    return [
      // Front face
      x-0.5, y-0.5,  z+0.5,
      x+0.5, y-0.5,  z+0.5,
      x+0.5,  y+0.5,  z+0.5,
      x-0.5,  y+0.5,  z+0.5,

      // Back face
      x-0.5, y-0.5, z-0.5,
      x-0.5,  y+0.5, z-0.5,
      x+0.5,  y+0.5, z-0.5,
      x+0.5, y-0.5, z-0.5,

      // Top face
      x-0.5,  y+0.5, z-0.5,
      x-0.5,  y+0.5,  z+0.5,
      x+0.5,  y+0.5,  z+0.5,
      x+0.5,  y+0.5, z-0.5,

      // Bottom face
      x-0.5, y-0.5, z-0.5,
      x+0.5, y-0.5, z-0.5,
      x+0.5, y-0.5,  z+0.5,
      x-0.5, y-0.5,  z+0.5,

      // Right face
      x+0.5, y-0.5, z-0.5,
      x+0.5, y+0.5, z-0.5,
      x+0.5, y+0.5,  z+0.5,
      x+0.5, y-0.5, z+0.5,

      // Left face
      x-0.5, y-0.5, z-0.5,
      x-0.5, y-0.5,  z+0.5,
      x-0.5,  y+0.5,  z+0.5,
      x-0.5,  y+0.5, z-0.5,
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

  Block.calculateOffset = function(blockType) {
    var blockSize = 1.0/16;
    var xOffset = blockType % 16 * blockSize;
    var yOffset = ((blockType/16)|(blockType/16)) * blockSize;
    return [xOffset, yOffset];
  };

  Block.calculateTextureOffsets = function() {
    var topOffset = this.calculateOffset(BLOCK_TYPES[this.type][0]);
    var otherOffset = this.calculateOffset(BLOCK_TYPES[this.type][1]);

    return [
      // Front face
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],

      // Back face
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],

      // Top face
       topOffset[0], topOffset[1],
       topOffset[0], topOffset[1],
       topOffset[0], topOffset[1],
       topOffset[0], topOffset[1],

      // Bottom face
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],

      // Right face
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],

      // Left face
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1],
       otherOffset[0], otherOffset[1]
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

  Block.calculateId = function() {
    var id = (this.x) |
    (this.y << 8) |
    (this.z << 16);

    return id;
  };
})();
