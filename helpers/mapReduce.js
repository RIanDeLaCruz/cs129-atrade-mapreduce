 /**
  * MapReduce helper functions
  * @module helpers/mapReduce
  *
  */

/*const mapReactions = function() {
  var reactions = this.post_reactions;
  for(var i = 0; i < reactions.length; i++) {
    emit({id: this.post_id, reaction_type: reactions[i].type}, 1);
  }
}

const reduceReactions = function(keyObject, valuesArr) {
  var count = 0;
  for(var i = 0; i < valuesArr.length; i++ ) {
    count += 1;
  }
  return count;
}
*/
const mapReactions = function() {
  var reactions = this.post_reactions;
  var comments = this.post_comment_total;
  emit({id: this.post_id}, {count: reactions.length+comments});
}

const reduceReactions = function(key, values) {
  var total = 0;
  for(var i = 0; i < values.length; i++ ) {
    toatl += values[i].count;
  }
  return {count:total};
}

module.exports = {
  mapReactions: mapReactions,
  reduceReactions: reduceReactions
}
