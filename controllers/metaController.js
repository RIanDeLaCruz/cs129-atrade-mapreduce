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
  let groupId = path.split('/')[2];
  let ids = [];

  getFeed(groupId, uri.query)
  .then(response => {
    let feedPromisesArray = [];
    feedResponse = response.toString();
    let feedObject = JSON.parse(feedResponse);
    ids = Object.keys(feedObject);
    for(var keys in feedObject) {
      let feedData = feedObject[keys].data;
      let promiseData = _mapDataToReaction(feedData);
      console.log(feedData)
      feedPromisesArray.push(
        _promiseAccumulator(
          promiseData.promiseArr,
          promiseData.idsArr,
          promiseData.storiesArr,
          promiseData.dates
        )
      )
    }
    let value = '';
    let postsArray = [];
    Promise.all(feedPromisesArray)
    .then(responseArray => {
      value = responseArray;
      let commentsMapArray = [];
      for(let i = 0; i < responseArray.length; i++) {
        commentsMapArray.push(_mapDataToComments(responseArray[i]));
      }
      return Promise.all(commentsMapArray)
      //res.end(JSON.stringify(responseArray))
    })
    .then(postCommentsArray => {
      let insertPromiseArray = [];
      for(let i = 0; i < postCommentsArray.length; i++) {
        let commentSummary = postCommentsArray[i].map(_handleCommentsArray)
        let posts = _mergeTwoArrays(value[i], commentSummary)
        postsArray.push(posts);
        insertPromiseArray.push(mongoInsert(posts, ids[i]))
      }
      return Promise.all(insertPromiseArray)
    })
    .then(r => {
      let returnObj = {};
      let allPosts = {};
      for(let i = 0; i < r.length; i++) {
        allPosts[ids[i]] = postsArray[i];
        returnObj[ids[i]] = r[i];
      }
      res.end(JSON.stringify(returnObj))
    })

    //_promiseAccumulator(
      //promiseData.promiseArr,
      //promiseData.idsArr,
      //promiseData.storiesArr,
      //promiseData.dates
    //)
    //.then(value => {
      //_mapDataToComments(value)
      //.then(withComments => {
        //let commentSummary = withComments.map(_handleCommentsArray)
        //let posts = _mergeTwoArrays(value, commentSummary)
        //mongoInsert(posts, groupId)
        //.then(r => { console.log(r) })
        //.catch(err => { console.log(err) })
        //res.end(JSON.stringify(posts))
      //})
    //})
  })
  .catch(err => {
    console.log(err)
  });
}

module.exports = metaController;
