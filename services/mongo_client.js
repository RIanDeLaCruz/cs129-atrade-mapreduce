const MongoClient = require('mongodb').MongoClient;
const assert =  require('assert');

const url = 'mongodb://localhost:27017/search_results';

const _insertDocs = function(db, collection, documentsArray) {
  var collection = db.collection(collection);
  var opts = {
    keepGoing: true,
    continueOnError: true,
    safe: true
  }
  return collection.insertMany(documentsArray, opts);
}

const insertDocuments = function(documentsArray) {
  let ops = documentsArray.map(function(curr, ndx, arr) {
    let queryObj = {
      updateOne : {
        filter: curr,
        update: curr,
        upsert: true
      }
    };
    return queryObj;
  })
  MongoClient.connect(url, function(err, db) {
    let col = db.collection('test');
    console.log(ops)
    var opts = {
      ordered: true,
      w: 1,
      safe: true
    }
    col.bulkWrite(ops, opts, function(err, result){
      if(err) console.log(err)
      console.log(result)
      db.close();
      return (err)? err: result;
    })
    //col.insertMany(documentsArray, opts, function(err, result) {
      //console.log(result)
      //db.close();
      //return (err)? err: result;
    //})
  })
  //return MongoClient.connect(url)
  //.then((db) => {
    //return _insertDocs(db, 'test', documentsArray)
    //.then(r => {
      //db.close();
      //return Promise.resolve(r);
    //})
  //})
  //.catch(err => {
    //console.log(err)
    //return Promise.reject(err);
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
