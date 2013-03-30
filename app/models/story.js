var Story = function () {

  this.defineProperties({
    pivotalId: {type: 'string', required: true},
    points: {type: 'int'},
    work: {type: 'string'}
  });

 this.hasMany('Entries');

  /*
  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Story.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Story.someStaticMethod = function () {
  // Do some other stuff
};
Story.someStaticProperty = 'YYZ';
*/

Story = geddy.model.register('Story', Story);

