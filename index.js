/* Require Modules from NPM and default Node installation */
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');

/* Require own modules */
const fbAuth = require('./services/server_authentication.js');
const fbGraph = require('./services/facebook_query.js');
const mongoActions = require('./services/mongo_client.js');
const mongoConnect = require('./services/mongo_client.js').dbConnect;
const mongoInsert = mongoActions.insertDocuments;
const getGroup = fbGraph.getGroup;
const getFeed = fbGraph.getGroupFeed;
const getReactions = fbGraph.getReactions;
const getComments = fbGraph.getComments;

/* Define constant values */
const hostname = '127.0.0.1';
const port = '8129';

var feedRes = '';

/**
 * Returns a Promise that contains an array of posts, with
 * their respective ids, story and reactions
 *
 * @param {Array} promises - Array of promises
 * @param {Array} ids - Array of ids
 * @param {Array} stories - Array of stories
 *
 * @returns {Promise} Promise that resolves with an array of Posts and metadata
 *
 */
const _promiseAccumulator = function(promises, ids, stories) {
  let returnObj = [];
  var ready = Promise.resolve(null);

  promises.forEach(function _promiseIteration(promise, index) {
    ready = ready.then(function _readyCallback() {
      return promise;
    })
    .then(value => {
      console.log(value)
      var individualObj = {};
      individualObj['post_id'] = `${ids[index]}`;
      individualObj['post_message'] = `${stories[index]}`;
      individualObj['post_reactions'] = JSON.parse(value).data;
      returnObj.push(individualObj);
    })
  })
  return ready.then(() => { return returnObj; });
}

/**
 * Returns a Promise that contains an array of posts, with
 * their respective ids, story and reactions
 *
 * @param {Array} data - Array of post objects
 *
 * @returns {Object} Object containing Promises, Ids, and Stories
 *
 */
const _mapDataToReaction = function(data) {
  let promiseArr = []
  let idsArr = []
  let storiesArr = []
  data.map(function(curr, index, arr) {
    promiseArr.push(getReactions(curr.id))
    idsArr.push(curr.id)
    storiesArr.push((curr.story) ? curr.story : curr.message );
  })
  return {
    promiseArr: promiseArr,
    idsArr: idsArr,
    storiesArr: storiesArr
  }
}

const server = http.createServer(function serverCallback (req, res) {
  var uri = url.parse(req.url);
  var path = url.parse(req.url).pathname;
  if(path === '/') {
      fs.readFile('index.html', function serveFile(error, content) {
        if(!error) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(content, 'utf-8');
        }
      });
  }
  if(path.indexOf('object') > 0) {
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
  if(path.indexOf('feed') > 0) {
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
  if(path.indexOf('reactions') > 0) {
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
  if(path.indexOf('meta') > 0 ) {

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
        promiseData.storiesArr)
      .then(value => {
        mongoInsert(value)
        .then(r => { console.log(r) })
        .catch(err => { console.log(err) })
        res.end(JSON.stringify(value))
      })
    })
    .catch(err => {
      console.log(err)
    });
  }
  if(path.indexOf('comments') > 0) {
    let commentsReponse = '';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    var groupId = path.split('/')[2];
    getComments(groupId, uri.query)
    .then(response => {
      console.log(response)
      commentsReponse = response.toString();
      res.end(commentsReponse);
    })
  }
});

server.listen(port, hostname, function listenCallback() {
  console.log(`Server running on port: ${hostname}:${port}`);
})
