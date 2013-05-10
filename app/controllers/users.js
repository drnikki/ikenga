var passport = require('../helpers/passport')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;

var Users = function () {
  // @todo remove add and create, move to seeds file.
  this.before(requireAuth, {
    except: ['add', 'create']
  });

  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.User.all(function(err, users) {
      self.respond({params: params, users: users});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , user = geddy.model.User.create(params)
      , sha;

    // Non-blocking uniqueness checks are hard
    geddy.model.User.first({username: user.username}, function(err, data) {
      if (data) {
        params.errors = {
          username: 'This username is already in use.'
        };
        self.transfer('add');
      }
      else {
        if (user.isValid()) {
          user.password = cryptPass(user.password);
        }
        user.save(function(err, data) {
          if (err) {
            params.errors = err;
            self.transfer('add');
          }
          else {
            self.redirect({controller: self.name});
          }
        });
      }
    });

  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (!user) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        user.getPivotalData(function(err, user) {
          // whattttt?  and whyyyyyy?  and i hate javascript 
          user.save(function(err, data) {
          if (err) {
            params.errors = err;

            self.respond({params: params, user: user.toObj()});
          }
          else {
            self.respond({params: params, user: user.toObj()});
          }
        });

        });
        self.respond({params: params, user: user.toObj()});
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (!user) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, user: user});
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      // Only update password if it's changed
      var skip = params.password ? [] : ['password'];

      user.updateAttributes(params, {skip: skip});

      if (params.password && user.isValid()) {
        user.password = cryptPass(user.password);
      }

      user.save(function(err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        } else {
          self.redirect({controller: self.name});
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.User.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  // can take parameters for what needs refreshing.
  // should be little callback links next to things.
  this.refreshPivotal = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(this.session.get('userId'), function(err, user) {
      if (!user) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {

        user.getPivotalData();
        console.log(user.projects);
        console.log(user);
        user.save(function(err, data) {});  // questionably located and implemented
        //self.respond({params: params, user: user.toObj()});
        self.redirect({controller: self.name});



       }
    });
  }

};

exports.Users = Users;
