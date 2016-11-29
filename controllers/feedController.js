/**
 * Feed Controller
 * @module controllers/feedController
 *
 */

const fbGraph = require('../services/facebook_query.js');
const getFeed = fbGraph.getGroupFeed;

const feedController = function(res, path, uri) {
  var groupResponse = '';
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  var groupId = path.split('/')[2]
  getFeed(groupId, uri.query)
  .then(response => {
    groupResponse = response.toString()
    res.end(groupResponse);
  })
  .catch(err => {
    console.log(err)
  });
}

module.exports = feedController;
