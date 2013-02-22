// makeClass - By John Resig (MIT Licensed)
function makeClass(){
  var Object = function(args){
    if ( this instanceof arguments.callee ) {
      if ( typeof this.init == "function" )
          this.init.apply( this, (args && args.callee) ? args : arguments );
    } else
      return new arguments.callee( arguments );
  };

  Object.prototype.bind = function ( fn ) {
    var self = this;
    return function () {
      fn.apply( self, arguments );
    };
  };

  return Object;
}
