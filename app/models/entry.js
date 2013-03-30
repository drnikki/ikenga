var Entry = function () {

  this.defineProperties({
    spent: {type: 'int'},
    remaining: {type: 'int'}
  });

  this.belongsTo('User');
  // or is it story?  @TODO
};

Entry = geddy.model.register('Entry', Entry);