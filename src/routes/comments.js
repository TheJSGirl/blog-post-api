const comments = require('express').Router();
const pool = require('../db');
const { sendResponse } = require('../helpers');

comments.route('/:id')
  .post(async (req, res) => {
  // validate id and comments
    req.checkBody('id', 'id is missing').exists();
    req.checkBody('comments', 'comment require').notEmpty().isAlphanumeric();
    const id = parseInt(req.params.id, 10);
    const { userId } = req.user;

    if (isNaN(id)) {
      return sendResponse(res, 422, [], 'invalid parameters');
    }

    const { comments } = req.body;

    try {
      const commentData = {
        comments,
        commentedBy: userId,
        commentedOn: id,
      };

      // query to insert comment detail in db
      const [comment] = await pool.query('INSERT INTO comments SET ?', commentData);

      return sendResponse(res, 200, comment, 'commented on post');
    } catch (err) {
      console.error(err);
      return sendResponse(res, 500, [], 'something went wrong');
    }
  });

comments.route('/:commentId')
  .delete(async (req, res) => {
  // validate id
    req.checkBody('commentId', 'id is missing').notEmpty();
    const commentId = parseInt(req.params.commentId, 10);
    const { userType } = req.user;
    const logedInUser = req.user.userId;

    if (isNaN(commentId)) {
      return sendResponse(res, 422, [], 'invalid parameters');
    }

    try {
      // execute query to find commentedBy user
      const [result] = await pool.query(`SELECT commentedBy FROM comments WHERE id = ${commentId}`);
      // console.log(result[0]);

      // validate if result is empty
      if (result.length === 0) {
        return sendResponse(res, 404, [], 'not found');
      }

      // check if logedInUser is equal to commentedBy then delete
      if (logedInUser === result[0].commentedBy) {
        const [deletedData] = await pool.query(`DELETE FROM comments WHERE commentedOn = ${commentId}`);
        return sendResponse(res, 200, deletedData, 'deletion successful');
      }

      // check if userType is 1 means admin then delete
      if (userType === 1) {
        const [deletedData] = await pool.query(`DELETE FROM comments WHERE id= ${commentId}`);
        return sendResponse(res, 200, deletedData, 'deletion successful');
      }
      return sendResponse(res, 403, [], 'you are not allowed to perform this action');
    } catch (err) {
      console.error(err);
      return sendResponse(res, 500, [], 'internal server error');
    }
  });

module.exports = comments;
