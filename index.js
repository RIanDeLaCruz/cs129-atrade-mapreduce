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

/* Define constant values */
const hostname = '127.0.0.1';
const port = '8129';

var feedRes = '';

const _promiseAccumulator = function(promises, ids) {
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
      individualObj['data'] = JSON.parse(value).data;
      returnObj.push(individualObj);
    })
  })
  return ready.then(() => { return returnObj; });
}

const _mapDataToReaction = function(data) {
  let promiseArr = []
  let idsArr = []
  data.map(function(curr, index, arr) {
    promiseArr.push(getReactions(curr.id))
    idsArr.push(curr.id)
  })
  return {
    promiseArr: promiseArr,
    idsArr: idsArr
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

      _promiseAccumulator(promiseData.promiseArr, promiseData.idsArr)
      .then(value => {
        console.log(value)
        console.log(mongoInsert(value))
        //mongoInsert(value)
        //.then(r => {console.log(r.result)})
        //.catch(err => {console.log(err)})
        res.end(JSON.stringify(value))
      })
    })
    .catch(err => {
      console.log(err)
    });
  }
});

server.listen(port, hostname, function listenCallback() {
  console.log(`Server running on port: ${hostname}:${port}`);
})
