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
    this.startVector = this.endVector = this.mapToSphere(event.clientX, event.clientY);
    this.boundMouseUp = this.bind( this.mouseup );
    this.boundMouseMove = this.bind( this.mousemove );
    window.document.addEventListener('mouseup', this.boundMouseUp, false);
    window.document.addEventListener('mousemove', this.boundMouseMove, false);
  };

  ArcballControls.mousemove = function(event) {
    this.endVector = this.mapToSphere(event.clientX, event.clientY);
  };

  ArcballControls.mouseup = function(event) {
    this.state = "";
    window.document.removeEventListener('mouseup', this.boundMouseUp);
    window.document.removeEventListener('mousemove', this.boundMouseMove);
  };

  ArcballControls.update = function() {
    if(this.state == "ROTATE") {
      var dot = vec3.dot(this.startVector, this.endVector);
      var lengthA = vec3.length(this.startVector);
      var lengthB = vec3.length(this.endVector);
      var angle = Math.acos(dot/lengthA/lengthB);
      
      angle *= 25;
      if (angle > 0) {
        var axis = vec3.create();
        vec3.cross(axis, this.startVector, this.endVector);
        var quaternion = quat.create();
        quat.setAxisAngle(quaternion, axis, -angle)

        this.camera.rotateWithQuaternion(quaternion);

        this.startVector = this.endVector;
      }
    }
  };


  ArcballControls.mapToSphere = function (clientX, clientY) {
    //var x = 1.0*event.clientX/this.viewportWidth*2 - 1.0;
    //var y = -1.0 * (1.0*event.clientY/this.viewportHeight*2 - 1.0);
    var radius = (this.viewportWidth + this.viewportHeight)/4;

    var x = ( clientX - this.viewportWidth * 0.5 ) / radius
	  var y = (this.viewportHeight * 0.5 - clientY ) / radius

    var vector = vec3.fromValues(x, y, 0);
    var squaredLength = vec3.squaredLength(vector);

    if (squaredLength > 1.0) {
      return vec3.normalize(vector, vector);
    } else {
      return vec3.set(vector, x, y, Math.sqrt(1.0 - squaredLength))
    }
  };
})();
