var User = function () {
  this.defineProperties({
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
    firstName: {type: 'string', required: true},
    lastName: {type: 'string', required: true},
    email: {type: 'string', required: true},
    pivotalApi: {type: 'string', required: true}
  });

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 8});
  this.validatesConfirmed('password', 'confirmPassword');

  this.hasMany('Passports');

  this.hasMany('Entries');
  this.hasMany('Stories'); // @todo rlly?

  // this is where a user object would populate itself 
  // with whatever pivotal tracker data it actually needs
  // @todo.
  this.getPivotalData = function() {
    // this is it.

  }

};

User = geddy.model.register('User', User);