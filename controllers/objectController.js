/*
 * Object Controller
 * @module controllers/objectController
 *
 */

const fbGraph = require('../services/facebook_query.js');
const getGroup = fbGraph.getGroup;

const objectController = function(res, path, uri) {
  var groupResponse = '';
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  var groupId = path.split('/')[2]
  getGroup(groupId)
  .then(response => {
    groupResponse = response.toString()
    res.end(groupResponse);
  })
  .catch(err => {
    console.log(err)
  });
}

module.exports = objectController

