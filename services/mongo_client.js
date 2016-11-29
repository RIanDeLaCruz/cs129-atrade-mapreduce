const MongoClient = require('mongodb').MongoClient;
const assert =  require('assert');

const url = 'mongodb://localhost:27017/search_results';

const _callbackInsert = function(documentsArray) {
  MongoClient.connect(url, function(err, db) {
    let col = db.collection('test');
    var opts = {
      ordered: true,
      w: 1,
      safe: true
    }
    col.bulkWrite(ops, opts, function(err, result){
      if(err) console.log(err)
      console.log(result)
      db.close();
      return (err) ? err: result;
    })
  })
}

/**
 * Maps an array of objects into an array of update operations
 *
 * @param {Number} curr - current array item in mapping
 * @param {Number} ndx - current index in mapping
 * @param {Array} arr - array being mapped
 *
 */
const _documentMap = function(curr, ndx, arr) {
  let queryObj = {
    updateOne : {
      filter: curr,
      update: curr,
      upsert: true
    }
  };
  return queryObj;
}

/**
 * Maps an array of objects into an array of update operations
 *
 * @param {Array} documentsArray - array of documents to be inserted
 *
 */
const insertDocuments = function(documentsArray) {
  let ops = documentsArray.map(_documentMap);
  let opts = {
    ordered: true,
    w: 1,
    safe: true
  }

  return MongoClient.connect(url)
  .then(db => {
    let col = db.collection('test');
    return col.bulkWrite(ops, opts)
  })
  .then(results => {
    return Promise.resolve(ops)
  })
  .catch(err => {
    return Promise.reject(err)
  })

  //MongoClient.connect(url, function(err, db) {
    //let col = db.collection('test');
    //var opts = {
      //ordered: true,
      //w: 1,
      //safe: true
    //}
    //col.bulkWrite(ops, opts, function(err, result){
      //if(err) console.log(err)
      //console.log(result)
      //db.close();
      //return (err) ? err: result;
    //})
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
