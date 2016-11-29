const commentsController = function(res, path, uri) {
  let commentsReponse = '';
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  var groupId = path.split('/')[2];
  getComments(groupId, uri.query)
  .then(response => {
    console.log(response)
    commentsReponse = response.toString();
    res.end(commentsReponse);
  })
}

module.exports = commentsController
