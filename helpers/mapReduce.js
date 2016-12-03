 /**
  * MapReduce helper functions
  * @module helpers/mapReduce
  *
  */

const mapReactions = function() {
  var reactions = this.post_reactions;
  for(var i = 0; i < reactions.length; i++) {
    emit({id: this.post_id, reaction_type: reactions[i].type}, 1);
  }
}

const reduceReactions = function(keyObject, valuesArr) {
  var count = 0;
  for(var i = 0; i < valuesArr.length - 1; i++ ) {
    count += 1;
  }
  return count;
}

module.exports = {
  mapReactions: mapReactions,
  reduceReactions: reduceReactions
}
