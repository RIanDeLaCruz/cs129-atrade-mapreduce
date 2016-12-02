 /**
  * MapReduce helper functions
  * @module helpers/mapReduce
  *
  */

const mapReactions = function() {
  emit(this.post_id, 1);
}

const reduceReactions = function(keyObject, valuesArr) {
  return valuesArr.length;
}

module.exports = {
  mapReactions: mapReactions,
  reduceReactions: reduceReactions
}
