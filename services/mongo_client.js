const MongoClient = require('mongodb').MongoClient;
const assert =  require('assert');

const reactionsMap = require('../helpers/mapReduce.js').mapReactions;
const reactionsReduce = require('../helpers/mapReduce.js').reduceReactions;

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
const insertDocuments = function(documentsArray, objectId) {
  let ops = documentsArray.map(_documentMap);
  let opts = {
    ordered: true,
    w: 1,
    safe: true
  }

  return MongoClient.connect(url)
  .then(db => {
    let col = db.collection(`_${objectId}`);
    return col.bulkWrite(ops, opts)
  })
  .then(results => {
    return mapReduceReactions(objectId)
  })
  .then(collectionData => {
    return Promise.resolve(collectionData)
  })
  .catch(err => {
    return Promise.reject(err)
  })
  //return MongoClient.connect(url)
  //.then(db => {
    //let col = db.collection(`_${objectId}`);
    //return col.bulkWrite(ops, opts)
  //})
  //.then(results => {
    //return Promise.resolve(ops)
  //})
  //.catch(err => {
    //return Promise.reject(err)
  //})
}


/**
 * Maps an array of objects into an array of update operations
 *
 * @param {Array} documentsArray - array of documents to be inserted
 *
 */
const mapReduceReactions = function(objectId) {
  let opts = {
    out: {replace: `_${objectId}.results`}
  }
  return MongoClient.connect(url)
  .then(db => {
    let col = db.collection(`_${objectId}`);
    return col.mapReduce(reactionsMap, reactionsReduce, opts)
  })
  .then(outCollection => {
    return outCollection.find()
  })
  .then(data => {
    return Promise.resolve(data.toArray())
  })
  .catch(err => {
    return Promise.reject(err)
    console.log(err)
  })
}

// Search query term
const filterQuery = function(term){
	db.collection.find({"post_message": /.*term.*/i});
}

module.exports = {
  insertDocuments: insertDocuments,
  mapReduceReactions: mapReduceReactions
};
