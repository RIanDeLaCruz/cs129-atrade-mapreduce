/**
 * Meta Controller
 * @module controllers/metaController
 *
 */

const mongoActions = require('../services/mongo_client.js');
const mongoInsert = mongoActions.insertDocuments;

const helpers = require('../helpers/arrayHelpers');
const _promiseAccumulator = helpers._promiseAccumulator;
const _mapDataToReaction = helpers._mapDataToReaction;
const _mapDataToComments = helpers._mapDataToComments
const _handleCommentsArray = helpers._handleCommentsArray;
const _mergeTwoArrays = helpers._mergeTwoArrays;

const fbGraph = require('../services/facebook_query.js');
const getFeed = fbGraph.getGroupFeed;

const metaController = function(res, path, uri) {
  let feedResponse = '';
  let feedData = '';
  let groupId = path.split('/')[2];

  getFeed(groupId, uri.query)
  .then(response => {
    feedResponse = response.toString();

    feedData = JSON.parse(feedResponse).data
    promiseData = _mapDataToReaction(feedData)

    _promiseAccumulator(
      promiseData.promiseArr,
      promiseData.idsArr,
      promiseData.storiesArr,
      promiseData.dates
    )
    .then(value => {
      _mapDataToComments(value)
      .then(withComments => {
        let commentSummary = withComments.map(_handleCommentsArray)
        let posts = _mergeTwoArrays(value, commentSummary)
        mongoInsert(posts, groupId)
        .then(r => { console.log(r) })
        .catch(err => { console.log(err) })
        res.end(JSON.stringify(posts))
      })
    })
  })
  .catch(err => {
    console.log(err)
  });
}

module.exports = metaController;
