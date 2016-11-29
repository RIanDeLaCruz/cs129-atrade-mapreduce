/*
 * Reactions Controller
 * @module controllers/reactionsController
 *
 */

const fbGraph = require('../services/facebook_query.js');
const getReactions = fbGraph.getReactions;

const reactionsController = function(res, path, uri) {
  var reactionResponse = '';
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  var groupId = path.split('/')[2];
  getReactions(groupId, uri.query)
  .then(response => {
    reactionResponse = response.toString();
    res.end(reactionResponse);
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports = reactionsController;
