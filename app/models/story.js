var Story = function () {

  this.defineProperties({
    pivotalId: {type: 'string', required: true},
    points: {type: 'int'},
    work: {type: 'string'}, // @todo this is NOT. A. GOOD. IDEA. probably.
    project: {type: 'string'}
  });

  this.hasMany('Entries');
};

Story = geddy.model.register('Story', Story);