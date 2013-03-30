var Stories = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;
    // @todo - here is where it gets limited by the user id
    // except for in the future when there is an admin user.
    // geddy.model.Story.all({userId : this.session.get('userId'))
    geddy.model.Story.all({userId : this.session.get('userId')}, function(err, stories) {
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



  /* todo 
    - how do stories get updated when ownership is transferred.
    - should be part of update above. ... if we only update the logged in user's pivotal information,
    if they lose a story, it will still be in their queue.  
    as a result, there needs to be a global update that can shuffle through all of the stories for each project
    a user is involved in, and update the owners.

    This is going to be a beast because it will 
      1. be a large loop and
      2. involve looking up the user id of each owner/each new owner.

      ALSO
      this means that the display name of the user must be identical to the display name that they use in pivotal tracker
      is there a way to get this from the api so that they aren't entrusted with updating it?  
      it changing is a pretty small usecase, but still will need to be addressed because even a small typo will 
      result in getting no stories for the user on an individual pivotal refresh.



  */
  this.pivotalRefresh = function (req, resp, params) {
    var self = this;

    // @TODO get the logged in user's API key
    var User = geddy.model.User;
    User.first({id: this.session.get('userId')}, function (err, data) {
      if (data) {
        var token = data.pivotalApi;
        var id = data.id;
      }  else { 
        // some sort of dying action. dying.
      }
    });
    console.dir(User);

    // @TODO remove -- testing so don't have to login every single time
    var token = "4e8b49f5bd39f3f8b152d536ffb77a5b";
    var userid = 'FE580D0F-CBF5-4954-BA59-B3A0B9F2605E';
    var username = "Nikki Stevens"; // @todoooooo

    var pivotal = require("pivotal");
    pivotal.debug = true;
    pivotal.useToken(token);

    // @todo project ids should be auto pulled in/ UI configurable
    var projectId = 766211;

    // @todo namez.
    var plzwork = pivotal.getStories(766211, 'filter=owner:"Nikki Stevens"', function(err, theStories) {
      
      //var xml = theStories;
      //console.log (xml)

      // ye olde for loop getting each story from the user
      // todo round two: filter by last checked date.
      for (storyNum in theStories.story) {
        theStory = theStories.story[storyNum]
      
        // here is where a more robust update/upsert check should be existing
        // geddy.model.Story.first(params.id, function(err, story) {
        //   story.updateProperties(params);
        //   if (!story.isValid()) {
        //     params.errors = story.errors;
        //     self.transfer('edit');
        //   }

        //   story.save(function(err, data) {
        //     if (err) {
        //       params.errors = err;
        //       self.transfer('edit');
        //     } else {
        //       self.redirect({controller: self.name});
        //     }
        //   });
        // });

        // totally WET and also not really the JS way.
        var params = Object;
        params.pivotalId = theStory.id;
        params.name = theStory.name;
        params.points = theStory.estimate;
        params.pivotalId = theStory.id;
        params.userId = userid;
        params.project = theStory.project_id;

        var story = geddy.model.Story.create(params);
        
        // TODO this should be update for existing ones. 
        // can't find upsert documentation for geddy.
        if (!story.isValid()) {
          params.errors = story.errors;
          self.transfer('add'); // @NOOOPE
        }
        story.save(function(err, data) {
          if (err) {
            params.errors = err;
            self.transfer('add');
          } else {
            self.redirect({controller: self.name});
          }
        });
      }

      self.redirect({controller: self.name});
      // which is where the stories would be limited to only the ones the logged in user owns.
      // @TODO  i copied this STRAIGHT FROM create above.  SO BAAAAD SO BAD SO BAD


  });

  };

 /** this should be used to refresh the status of just one story maybe
   while I work on getting something that refreshes the status of all the new ones.

    @TODO can you get just the latest?  prollz
  **/
  this.pivotalRefreshGetOne = function (req, resp, params) {
    var self = this;

    // @TODO get the logged in user's API key
    var User = geddy.model.User;
    User.first({id: this.session.get('userId')}, function (err, data) {
      if (data) {
        var token = data.pivotalApi;
        var id = data.id;
      }  else { 
        // some sort of dying action. dying.
      }
    });
    console.dir(User);

    // @TODO remove -- testing so don't have to login every single time
    var token = "4e8b49f5bd39f3f8b152d536ffb77a5b";
    var userid = 'FE580D0F-CBF5-4954-BA59-B3A0B9F2605E';

    var pivotal = require("pivotal");
    pivotal.debug = true;
    pivotal.useToken(token);

    // @todo namez.
    var test = pivotal.getStory(766211, 47106947, function(err, theStory) {
      //
      var xml = theStory;

      var params = Object;
      params.pivotalId = theStory.id;
      params.name = theStory.name;
      params.points = theStory.estimate;
      params.pivotalId = theStory.id;
      params.userId = userid;
      // @todo don't want to login for testing. lazy.


      // @TODO  i copied this STRAIGHT FROM create above.  SO BAAAAD SO BAD SO BAD
      var story = geddy.model.Story.create(params);
      // @TODO this should be update for existing ones. 
      //console.dir(story);
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
    });
  };

  /* to save some console logging. Here is what a story looks like:

  { id: '46552621',
    project_id: '766211',
    story_type: 'feature',
    url: 'http://www.pivotaltracker.com/story/show/46552621',
    estimate: '-1',
    current_state: 'unstarted',
    description: {},
    name: 'IGNORE THIS TESTING STORY',
    requested_by: 'Nikki Stevens',
    owned_by: 'Nikki Stevens',
    created_at: '2013/03/20 16:24:02 UTC',
    updated_at: '2013/03/26 14:52:50 UTC',
    notes: { note: [ [Object], [Object] ] },
    tasks: 
     { task: 
        { id: '13365535',
          description: 'AND TASK',
          position: '1',
          complete: 'false',
          created_at: '2013/03/20 16:24:02 UTC' } } }
  **/


}; // the end of it all

exports.Stories = Stories;
