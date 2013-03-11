//= require makeClass
//= require gl-matrix-2

var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.ArcballControls = makeClass();
  var ArcballControls = MinecraftEditor.ArcballControls.prototype;

  ArcballControls.init = function(camera) {
    this.camera = camera;
    this.viewportWidth = camera.viewportWidth;
    this.viewportHeight = camera.viewportHeight;
    this.radius = (this.viewportHeight + this.viewportWidth) / 4;
    window.document.addEventListener('mousedown', this.bind( this.mousedown ), false);
  };

  ArcballControls.mousedown = function(event) {
    this.state = "ROTATE";
    this.startPoint = this.endPoint = this.mapToSphere(event.clientX, event.clientY);
    this.boundMouseUp = this.bind( this.mouseup );
    this.boundMouseMove = this.bind( this.mousemove );
    window.document.addEventListener('mouseup', this.boundMouseUp, false);
    window.document.addEventListener('mousemove', this.boundMouseMove, false);
  };

  ArcballControls.mousemove = function(event) {
    this.endPoint = this.mapToSphere(event.clientX, event.clientY);
  };

  ArcballControls.mouseup = function(event) {
    this.state = "";
    window.document.removeEventListener('mouseup', this.boundMouseUp);
    window.document.removeEventListener('mousemove', this.boundMouseMove);
  };

  ArcballControls.update = function(deltaTime) {
    if(this.state == "ROTATE") {
      var deltaX = this.endPoint[0] - this.startPoint[0]
      var deltaY = this.endPoint[1] - this.startPoint[1]
      
      var pitch = (deltaY * deltaTime);
      var yaw = (deltaX * deltaTime);

      this.camera.rotateX(pitch);
      this.camera.rotateY(-yaw);

      this.startPoint = this.endPoint;
    }
  };


  ArcballControls.mapToSphere = function (clientX, clientY) {
    var x = 1.0*event.clientX/this.viewportWidth*2 - 1.0;
    var y = -1.0 * (1.0*event.clientY/this.viewportHeight*2 - 1.0);

    return [x, y]
  };
})();
