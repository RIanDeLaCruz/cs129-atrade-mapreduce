const mongoActions = require('../services/mongo_client.js');

const searchController = function(res, path, uri) {
  // Do the searching and return here
  return db.collection.find({"post_message": /.*term.*/i});
}

module.exports = searchController;
//_CompsAteneo
