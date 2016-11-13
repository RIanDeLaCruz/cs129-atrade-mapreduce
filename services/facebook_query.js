/* Require built-in Node Modules */
const https = require('https');

const fbAuth = require('./server_authentication.js');
const variables = require('../keys.json');

_generateToken = function() {
  return fbAuth();
}

getGroup = function(id) {
  var token = '';
  return _generateToken()
  .then(response => {
    let res_split = response.toString().split('=');
    token = res_split[1];

    let getUrl = `${variables.hostname}/${id}?access_token=${token}`

    return new Promise(function(resolve, reject) {
      https.get(getUrl, function(res) {
        res.on('data', (d) => {
          resolve(d.toString());
        })
      }).on('error', (err) => {
        reject(err);
      })
    })
  })
  .catch(error => {
    console.log(error)
  });
}

getGroupFeed = function(token, id) {
}

module.exports = {
  getGroup: getGroup
}
