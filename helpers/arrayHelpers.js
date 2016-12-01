/**
 * Helper Module
 * @module helpers/arrayHelpers
 *
 */

/**
 * Returns a Promise that contains an array of posts, with
 * their respective ids, story and reactions
 *
 * @param {Array} promises - Array of promises
 * @param {Array} ids - Array of ids
 * @param {Array} stories - Array of stories
 *
 * @returns {Promise} Promise that resolves with an array of Posts and metadata
 *
 */
const _promiseAccumulator = function(promises, ids, stories, dates) {
  let returnObj = [];
  var ready = Promise.resolve(null);

  promises.forEach(function _promiseIteration(promise, index) {
    ready = ready.then(function _readyCallback() {
      return promise;
    })
    .then(value => {
      //console.log(value)
      var individualObj = {};
      individualObj['post_id'] = `${ids[index]}`;
      individualObj['date_posted'] = `${dates[index]}`;
      individualObj['post_message'] = `${stories[index]}`;
      individualObj['post_reactions'] = JSON.parse(value).data;
      returnObj.push(individualObj);
    })
  })
  return ready.then(() => { return returnObj; });
}

/**
 * Returns a Promise that contains an array of posts, with
 * their respective ids, story and reactions
 *
 * @param {Array} data - Array of post objects
 *
 * @returns {Object} Object containing Promises, Ids, and Stories
 *
 */
const _mapDataToReaction = function(data) {
  let promiseArr = []
  let idsArr = []
  let storiesArr = []
  let dateArray = []
  data.map(function(curr, index, arr) {
    promiseArr.push(getReactions(curr.id))
    idsArr.push(curr.id)
    storiesArr.push((curr.story) ? curr.story : curr.message );
    dateArray.push(curr.created_time)
  })
  return {
    promiseArr: promiseArr,
    idsArr: idsArr,
    storiesArr: storiesArr,
    dates: dateArray
  }
}

/**
 * Returns an array of promises to get comments
 *
 * @param {Array} postArray - An array of post objects
 *
 * @returns {Promise} Promise that resolves with an in-order array of values from the parameters
 *
 */
const _mapDataToComments = function(postArray) {
  let getCommentsPromises = [];
  postArray.map(function(curr, index, arr) {
    getCommentsPromises.push(getComments(curr.post_id, 'summary=1&filter=stream'))
  });
  return Promise.all(getCommentsPromises);
}

/**
 * Mapping function to return the total count of comments
 *
 * @param {Object} curr - Current object/item
 * @param {Number} ndx - Current object/item
 * @param {Array} arr - Array being mapped
 *
 * @return {Number} Total count of comments
 *
 */
const _handleCommentsArray = function(curr, ndx, arr) {
  return JSON.parse(curr).summary.total_count;
}

/**
 * Merge two arrays
 *
 * @param {Array} arr1 - Array of JSON
 * @param {Array} arr2 - Array of primitives
 *
 * @return {Array} Array where arr2 values is merged into each object in arr1 respectively
 *
 */
const _mergeTwoArrays = function(arr1, arr2) {
  let retArr = arr1.map(function(curr, ndx, arr) {
    curr['post_comment_total'] = arr2[ndx];
    return curr;
  })
  return retArr;
}


module.exports = {
  _promiseAccumulator: _promiseAccumulator,
  _mapDataToReaction: _mapDataToReaction,
  _mapDataToComments: _mapDataToComments,
  _handleCommentsArray: _handleCommentsArray,
  _mergeTwoArrays: _mergeTwoArrays
}
