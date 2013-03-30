var Stories = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Story.all(function(err, stories) {
      self.respond({params: params, stories: stories});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , story = geddy.model.Story.create(params);

    if (!story.isValid()) {
      params.errors = story.errors;
      self.transfer('add');
    }

    story.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Story.first(params.id, function(err, story) {
      if (!story) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, story: story.toObj()});
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Story.first(params.id, function(err, story) {
      if (!story) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, story: story});
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Story.first(params.id, function(err, story) {
      story.updateProperties(params);
      if (!story.isValid()) {
        params.errors = story.errors;
        self.transfer('edit');
      }

      story.save(function(err, data) {
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

    geddy.model.Story.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Stories = Stories;
