const https = require('https');

const variables = require('./../keys.json');

module.exports = function() {
  const reqObj = {
    hostname: `${variables.auth_url}`,
    path: `${variables.auth_path}`+
      `?client_id=${variables.client_id}`+
      `&client_secret=${variables.client_secret}&grant_type=client_credentials`
  }
  return new Promise(function(resolve, reject) {
    https.get(reqObj, function(res){
      res.on('data', (d) => {
        resolve(d);
      })
    }).on('error', err => {
      reject(err);
    });
  })
}
