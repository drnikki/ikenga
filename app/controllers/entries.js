var Entries = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Entry.all({userId : this.session.get('userId')}, function(err, entries) {
      self.respond({params: params, entries: entries});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    logged_in_id = this.session.get('userId');
    if (!logged_in_id) {
        //@ todo - this should be auth restricted
        logged_in_id = "REMOVE ME THIS IS TESTING";
    }
    params.userId = logged_in_id;

    var self = this
      , entry = geddy.model.Entry.create(params);

    if (entry.isValid()) {
      params.errors = entry.errors;
      self.transfer('add');
    }

    entry.save(function(err, data) {
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

    geddy.model.Entry.first(params.id, function(err, entry) {
      if (!entry) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, entry: entry.toObj()});
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Entry.first(params.id, function(err, entry) {
      if (!entry) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, entry: entry});
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Entry.first(params.id, function(err, entry) {
      entry.updateProperties(params);
      if (!entry.isValid()) {
        params.errors = entry.errors;
        self.transfer('edit');
      }

      entry.save(function(err, data) {
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

    geddy.model.Entry.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Entries = Entries;
