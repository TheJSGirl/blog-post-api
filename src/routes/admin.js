const adminRoute = require('express').Router();
const { sendResponse } = require('../helpers');
const pool = require('../db');


adminRoute.route('/posts/:postId').patch(async (req, res) => {
  try {
    // validate postId
    req.check('postId', 'post id is required').exists().isInt();
    req.check('postTitle', 'postTitle is required/minimum 3 chars').optional().isLength({ min: 3 });
    req.check('description', 'description is required/minimum 3 chars').optional().isLength({ min: 3 });
    
    const errors = req.validationErrors();
    if (errors) {
      return sendResponse(res, 400, [], 'missing post info');
    }

    const postId = parseInt(req.params.postId, 10);

    const { postTitle, description } = req.body;
    const updateValues = []; // to store update values, if any

    // check if postTitle or description is empty
    if (!postTitle && !description) {
      return sendResponse(res, 200, [], 'nothing to update');
    }

    if (postTitle) {
      updateValues.push(`postTitle = '${postTitle}'`);
    }

    if (description) {
      updateValues.push(`description = '${description}' `);
    }

    if (updateValues.length) {
      // if there is any value to update then only execute sql query
      const updateQuery = `UPDATE blogs SET ${updateValues.join()} WHERE id = ?`;
      await pool.query(updateQuery, postId);
    }

    return sendResponse(res, 200, [], 'updated successfully');
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, [], 'internal server error');
  }
});

// admin deletes posts using postId
adminRoute.route('/posts/:postId').delete(async (req, res) => {
  // validate id
  req.check('postId', 'missing parameters').exists().isInt();
  const errors = req.validationErrors();
  if (errors) {
    return sendResponse(res, 400, [], errors[0].msg);
  }

  const postId = parseInt(req.params.postId, 10);

  try {
    await pool.query('DELETE FROM blogs WHERE id = ?', postId);
    return sendResponse(res, 200, [], 'deleted successfully');
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, [], 'internal server error');
  }
});

// admin deletes comments using commentId
adminRoute.route('/posts/:postId/comments/:commentId').delete(async (req, res) => {
  // validate id
  req.check('commentId', 'missing comment info').exists().isInt();
  const errors = req.validationErrors();
  if (errors) {
    return sendResponse(res, 400, [], errors[0].msg);
  }

  const { commentId } = req.params;

  try {
    await pool.query('DELETE FROM comments WHERE id= ?', commentId);
    return sendResponse(res, 200, [], 'comment deleted successfully');
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, [], 'internal server error');
  }
});


module.exports = adminRoute;
