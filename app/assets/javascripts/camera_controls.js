//= require makeClass
//= require gl-matrix-2

var MinecraftEditor = MinecraftEditor || {};
(function() {
  MinecraftEditor.CameraControls = makeClass();
  var CameraControls = MinecraftEditor.CameraControls.prototype;

  var STATES = { ROTATE: 0, PAN: 1, ZOOM: 2 };
  var rotationSpeed = 5;
  var panSpeed = 3;
  var zoomSpeed = 3;

  CameraControls.init = function(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    this.state = null;
    window.document.addEventListener('mousedown', this.bind( this.mousedown ), false);
    window.addEventListener('resize', this.bind( this.handleResize ), false);
  };

  CameraControls.mousedown = function(event) {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();

    if (event.button === 0) {
      this.state = STATES.ROTATE;
    }

    if (event.button === 0 && event.altKey === true) {
      this.state = STATES.PAN;
    }

    if (event.button === 0 && event.shiftKey === true) {
      this.state = STATES.ZOOM;
    }

    this.startPoint = this.endPoint = this.camera.convertCoords(event.clientX, event.clientY);
    this.boundMouseUp = this.bind( this.mouseup );
    this.boundMouseMove = this.bind( this.mousemove );
    this.canvas.addEventListener('mouseup', this.boundMouseUp, false);
    this.canvas.addEventListener('mousemove', this.boundMouseMove, false);
  };

  CameraControls.mousemove = function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.endPoint = this.camera.convertCoords(event.clientX, event.clientY);
  };

  CameraControls.mouseup = function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.state = null;
    this.canvas.removeEventListener('mouseup', this.boundMouseUp);
    this.canvas.removeEventListener('mousemove', this.boundMouseMove);
  };

  CameraControls.handleResize = function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.resizeViewport(this.canvas.width,
                               this.canvas.height);
  };

  CameraControls.update = function(deltaTime) {
    if (this.state === null) { 
      return;
    }

    var deltaX = this.endPoint[0] - this.startPoint[0]
    var deltaY = this.endPoint[1] - this.startPoint[1]
    
    if(this.state == STATES.ROTATE) {
      this._rotateCamera(deltaX, deltaY, deltaTime);
    }

    if(this.state == STATES.PAN) {
      this._panCamera(deltaX, deltaY, deltaTime);
    };

    if(this.state == STATES.ZOOM) {
      this._zoomCamera(deltaX, deltaY, deltaTime);
    };

    this.startPoint = this.endPoint;
  };

  CameraControls._rotateCamera = function(deltaX, deltaY, deltaTime) {
    var pitch = (deltaY * deltaTime)*rotationSpeed;
    var yaw = (deltaX * deltaTime)*rotationSpeed;

    this.camera.rotateX(pitch);
    this.camera.rotateY(-yaw);

  };

  CameraControls._panCamera = function(deltaX, deltaY, deltaTime) {
    var x = (deltaX * deltaTime)*panSpeed;
    var y = (deltaY * deltaTime)*panSpeed;

    this.camera.panX(x);
    this.camera.panY(y);
  };

  CameraControls._zoomCamera = function(deltaX, deltaY, deltaTime) {
    var zoomFactor = (deltaY * deltaTime)*zoomSpeed;

    this.camera.zoom(zoomFactor);
  };

})();
