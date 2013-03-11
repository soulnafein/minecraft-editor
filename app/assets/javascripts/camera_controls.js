//= require makeClass
//= require gl-matrix-2

var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.CameraControls = makeClass();
  var CameraControls = MinecraftEditor.CameraControls.prototype;

  CameraControls.init = function(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    window.document.addEventListener('mousedown', this.bind( this.mousedown ), false);
    window.addEventListener('resize', this.bind( this.handleResize ), false);
  };

  CameraControls.mousedown = function(event) {
    this.state = "ROTATE";
    this.startPoint = this.endPoint = this.camera.convertCoords(event.clientX, event.clientY);
    this.boundMouseUp = this.bind( this.mouseup );
    this.boundMouseMove = this.bind( this.mousemove );
    window.document.addEventListener('mouseup', this.boundMouseUp, false);
    window.document.addEventListener('mousemove', this.boundMouseMove, false);
  };

  CameraControls.mousemove = function(event) {
    this.endPoint = this.camera.convertCoords(event.clientX, event.clientY);
  };

  CameraControls.mouseup = function(event) {
    this.state = "";
    window.document.removeEventListener('mouseup', this.boundMouseUp);
    window.document.removeEventListener('mousemove', this.boundMouseMove);
  };

  CameraControls.handleResize = function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.resizeViewport(this.canvas.width,
                               this.canvas.height);
  };

  CameraControls.update = function(deltaTime) {
    if(this.state == "ROTATE") {
      var deltaX = this.endPoint[0] - this.startPoint[0]
      var deltaY = this.endPoint[1] - this.startPoint[1]
      
      var pitch = (deltaY * deltaTime)*3;
      var yaw = (deltaX * deltaTime)*3;

      this.camera.rotateX(pitch);
      this.camera.rotateY(-yaw);

      this.startPoint = this.endPoint;
    }
  };

})();
