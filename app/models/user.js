var User = function () {
  this.defineProperties({
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
    firstName: {type: 'string', required: true},
    lastName: {type: 'string', required: true},
    email: {type: 'string', required: true},
    pivotalApi: {type: 'string', required: true},
    pivotalDisplayName: {type: 'string', required: false},
    projects: {type: 'string', required: false}
  });

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 8});
  // @todo this should be an FE thing, rather than in the model
  // this.validatesConfirmed('password', 'confirmPassword');

  this.hasMany('Passports');

  this.hasMany('Entries');
  this.hasMany('Stories'); // @todo rlly?

  // this is where a user object would populate itself 
  // with whatever pivotal tracker data it actually 
  // AND HAS ACCESS to. stupid PT
  this.getPivotalData = function(callback) {
    var pivotal = require("pivotal");
    pivotal.useToken(this.pivotalApi);

    // @todo - limit data returned to just project ids? but cannot...
    var plzwork = pivotal.getProjects(function(err, theProjects) {
      projectIds = new Array();
      for (projectNum in theProjects.project) {
      // we could collect a lot of other project data here, but... meh.
        projectIds.push(theProjects.project[projectNum].id);
      }
    this.projects = projectIds.toString();
    });

  }

};

User = geddy.model.register('User', User);