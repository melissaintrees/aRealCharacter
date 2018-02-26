// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");
var friends = require('../data/friends.js');

// console.log(friends)
module.exports = function (app) {


  // A GET route with the url `/api/friends`. returns friends
  app.get("/api/friends", function (req, res) {
    // this routes the initial friends (what is in the friends.js) array to the api/friends path:
    // console.log("This is the response: ", res);
    res.json(friends);
  });

  // POST route for /api/friends that takes in the new user data and responds with the most compatible match.
  app.post("/api/friends", function (req, res) {

    // console.log("This is the request: ", req);
    // store the req object in a var called UserInput:
    var userInput = req.body;
    var differences = [];

    // If there are more then one friends to compare to, do this:
    if (friends.length > 1) {
      // Step through these potential friends.
      friends.forEach(function (user) {
        var totalDifference = 0;

        // For each answer, compare the surveyScores and add the absolute value of the difference to the total difference.
        for (var i = 0; i < userInput.surveyScores.length; i++) {
          var otherAnswer = user.surveyScores[i];
          var thisAnswer = userInput.surveyScores[i];
          var difference = +otherAnswer - +thisAnswer;
          totalDifference += Math.abs(difference);
        }
        differences.push(totalDifference);
      });
      // Find the minimum difference score.
      var minimumDifference = Math.min.apply(null, differences);
      // Since there may be more than one potential friend with that score, create an array.
      var bestMatches = [];
      // For each item in differences, if it is equal to the minimumDifference, add the corresponding friendData to the bestMatches array.
      for (var i = 0; i < differences.length; i++) {
        if (differences[i] === minimumDifference) {
          bestMatches.push(friends[i]);
        }
      }

      // Then send bestMatches to the client.
      console.log(bestMatches);
      res.json(bestMatches);

      // If there is only one friend to compare to, skip all that work and just send back that friend.
    } else {
      res.json(friends);
    }
    // if only one friend to compare to push the UserInput to the friends Object and only send back one friend:
    friends.push(userInput);
  });
};


