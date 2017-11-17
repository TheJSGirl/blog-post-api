const comments = require('express').Router();
const pool = require('../db');
const { sendResponse } = require('../helpers');

comments.route('/:postId/comments').post(async (req, res) => {
  // validate postId and comments
  req.check('postId', 'postId is missing').exists().isInt();
  req.check('comment', 'comment require').exists().isLength({ min: 2 });

  const postId = parseInt(req.params.postId, 10);
  const { userId } = req.user;

  const { comment } = req.body;

  try {
    const commentData = {
      comments: comment,
      commentedBy: userId,
      commentedOn: postId,
    };

      // query to insert comment detail in db
    await pool.query('INSERT INTO comments SET ?', commentData);

    return sendResponse(res, 200, [], 'commented on post');
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, [], 'something went wrong');
  }
});


module.exports = comments;
