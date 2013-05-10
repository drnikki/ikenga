
  	var pivotal = require("pivotal");
  	//pivotal.debug = true;
	pivotal.useToken("4e8b49f5bd39f3f8b152d536ffb77a5b");
	//console.log(pivotal);
	//console.log(pivotal.getProjects());
	//console.log(pivotal.getProject(766211));

	//console.log(pivotal.getActivities());
	// story id 46552621


	// THIS WORKSSSSS.
	// var test = pivotal.getStory(766211, 46552621, function(err, theStory) {
	// 	var parseString = require('xml2js').parseString;
	// 	console.dir(theStory)
	// 	var xml = theStory;
	// 	parseString(xml, function (err, result) {
	// 	    console.dir(result);
	// 	    console.dir('in the story one')
	// 	});
	// 	// xml = err;
	// 	// parseString(xml, function (err, result) {
	// 	//     console.dir(result);
	// 	//     console.dir('in the err one')
	// 	// });
	// });
  // curl -H "X-TrackerToken: 4e8b49f5bd39f3f8b152d536ffb77a5b" -X GET http://www.pivotaltracker.com/services/v3/projects/766211/stories?filter=owner%3A%22Nikki%20Stevens%22    

	// var test = pivotal.getStories(766211, 'filter=owner:"Nikki Stevens"', function(err, theStories) {
	// 	var parseString = require('xml2js').parseString;
	// 	//console.dir(theStories)
	// 	var xml = theStories.toString();
	// 	// not a bom
	// 	//var cleanedString = xml.toString().replace("\ufeff", "");
	// 	parseString(xml, function (err, result) {
	// 	   // console.dir(result);
	// 	   // console.dir(err);
	// 	   // console.dir('in the story one')
	// 	});


	//  });

    // @todo Need way to let user omit some projects
    var plzwork = pivotal.getProjects(function(err, theProjects) {
      //console.dir(theProjects)
      projectIds = new Array();
	  for (projectNum in theProjects.project) {
	  	// we could collect a lot of other project data here, but... meh.
        projectIds.push(theProjects.project[projectNum].id);

    	}
    console.log(projectIds.toString());
  });


    //console.log(test);
    console.log('wtf');



