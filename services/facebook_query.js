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

getGroupFeed = function(id) {
  var token = '';
  return _generateToken()
  .then(response => {
    token = _getTokenFromResponse(response);

    let getUrl = `${variables.hostname}/${id}/feed?access_token=${token}`
    let buffer = '';

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

module.exports = {
  getGroup: getGroup,
  getGroupFeed: getGroupFeed
}
