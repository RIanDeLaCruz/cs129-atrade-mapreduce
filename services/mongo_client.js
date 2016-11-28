const MongoClient = require('mongodb').MongoClient;
const assert =  require('assert');

const url = 'mongodb://localhost:27017/search_results';

const _insertDocs = function(db, collection, documentsArray) {
  var collection = db.collection(collection);
  return collection.insertMany(documentsArray)
}

const insertDocuments = function(documentsArray) {
  return MongoClient.connect(url)
  .then((db) => {
    return _insertDocs(db, 'test', documentsArray)
    .then(r => {
      db.close();
      return Promise.resolve(r);
    })
  })
  .catch(err => {
    return err;
  })
  //MongoClient.connect(url, function _insertManyCallback(err, db) {
    //assert.equal(null, err);
  //})
}

const dbConnect = function() {
  MongoClient.connect(url, function _connectCallback(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    db.close();
  });
}

module.exports = {
  dbConnect: dbConnect,
  insertDocuments: insertDocuments
};
