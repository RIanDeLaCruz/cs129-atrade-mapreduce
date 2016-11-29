/* Require built-in Node Modules */
const https = require('https');

const fbAuth = require('./server_authentication.js');
const variables = require('../keys.json');

_getTokenFromResponse = function(response) {
  let res_split = response.toString().split('=');
  return res_split[1];
}

_generateToken = function() {
  return fbAuth();
}

/* Fields returned are comma-separated while paramaters are delimited by & */

getGroup = function(id) {
  var token = '';
  return _generateToken()
  .then(response => {
    token = _getTokenFromResponse(response);

    let getUrl = `${variables.hostname}/${id}?access_token=${token}`

    return new Promise(function(resolve, reject) {
      https.get(getUrl, function(res) {
        res.on('data', (d) => {
          resolve(d.toString());
        });
      }).on('error', (err) => {
        reject(err);
      });
    })
  })
  .catch(error => {
    console.log(error)
  });
}

/* Fields are comma-separated and the different parameters are separated by & */

getGroupFeed = function(id, query = null) {
  var token = '';
  return _generateToken()
  .then(response => {
    token = _getTokenFromResponse(response);

    let getUrl = `${variables.hostname}/${id}/feed?`;
    let buffer = '';
    if(query != null) {
      getUrl+=`${query}&access_token=${token}`;
    } else {
      getUrl+=`access_token=${token}`;
    }
    console.log(getUrl)

    return new Promise(function(resolve, reject) {
      https.get(getUrl, function(res) {
        res.on('data', (d) => {
          buffer += d;
        });
        res.on('end', () => {
          resolve(buffer)
        })
        res.on('error', (err) => {
          reject(err);
        });
      })
    })
  })
}

getReactions = function(id, query = null) {
  var token = '';
  return _generateToken()
  .then(response => {
    token = _getTokenFromResponse(response);

    let getUrl = `${variables.hostname}/${id}/reactions?`;
    let buffer = '';
    if(query != null) {
      getUrl+=`${query}&access_token=${token}`;
    } else {
      getUrl+=`access_token=${token}`;
    }
    console.log(getUrl)

    return new Promise(function(resolve, reject) {
      https.get(getUrl, function(res) {
        res.on('data', (d) => {
          buffer += d;
        });
        res.on('end', () => {
          resolve(buffer)
        })
        res.on('error', (err) => {
          reject(err);
        });
      })
    })
  })
}

getComments = function(id, query = null) {
  var token = '';
  return _generateToken()
  .then(response => {
    token = _getTokenFromResponse(response);

    let getUrl = `${variables.hostname}/${id}/comments?`;
    let buffer = '';
    if(query != null) {
      getUrl+=`${query}&access_token=${token}`;
    } else {
      getUrl+=`access_token=${token}`;
    }
    return new Promise(function(resolve, reject) {
      https.get(getUrl, function(res) {
        res.on('data', (d) => {
          buffer += d;
        });
        res.on('end', () => {
          resolve(buffer)
        })
        res.on('error', (err) => {
          reject(err);
        });
      })
    })
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports = {
  getGroup: getGroup,
  getGroupFeed: getGroupFeed,
  getReactions: getReactions,
  getComments: getComments
}
