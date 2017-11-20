const postRoute = require('express').Router();
const pool = require('../db');
const { sendResponse } = require('../helpers');

postRoute.route('/').get(async (req, res) => {
  req.check('limit', 'limit should be int').exists().isInt().optional();
  req.check('offset', 'offset should be int').exists().isInt().optional();
  req.check('searchBy', 'searchBy should be present').exists().isLength({ min: 3 }).optional();
  req.check('keyword', 'keyword should be present').exists().isLength({ min: 3 }).optional();

  const errors = req.validationErrors();

  if (errors) {
    return sendResponse(res, 400, [], errors[0].msg);
  }

  const { limit } = req.query;
  const { offset } = req.query;
  const { searchBy } = req.query;
  const { keyword } = req.query;
  try {
    // get all posts
    let getQuery = 'SELECT b.id, b.postTitle, b.description, u.userName AS author, b.createdAt FROM blogs b INNER JOIN users u ON b.createdBy = u.id';

    // concatenate query with getQuery to get author posts
    if (searchBy && keyword) {
      getQuery += ` WHERE ${searchBy} LIKE '%${keyword}'`;
    }

    // concatenate query with getQuery to get posts in limit
    if (limit && offset) {
      getQuery += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    // console.log(getQuery);

    const [data] = await pool.query(getQuery);
    // console.log(data);
    if (data.length === 0) {
      return sendResponse(res, 404, [], 'not found');
    }

    // comments query on post
    const commentQuery = 'SELECT c.id as commentId, c.comments,c.commentedOn, c.createdAt, u.userName as commentedBy FROM comments c INNER JOIN blogs ON c.commentedOn = blogs.id INNER JOIN users  u ON c.commentedBy = u.id';

    // execute query and get comments on a particular post
    const [comments] = await pool.query(commentQuery);

    data.forEach((post) => {
      const tempArr = [];
      comments.forEach((comment) => {
        if (comment.commentedOn === post.id) {
          tempArr.push(comment);
        }
      });
      post.comments = tempArr;
      post.commentCount = tempArr.length;
    });

    return sendResponse(res, 200, data, 'successful');
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, [], 'internal server error');
  }
});

postRoute.route('/').post(async (req, res) => {
  console.log(req.body);
  // validate
  req.checkBody('postTitle', 'title is missing').exists();
  req.checkBody('description', 'description is too short or missing description field').exists();

  const errors = req.validationErrors();

  if (errors) {
    return sendResponse(res, 400, [], errors[0].msg);
  }

  try {
    // get loggedin userId
    const { userId } = req.user;

    const { postTitle, description } = req.body;

    // object of post
    const post = {
      postTitle,
      createdBy: userId,
      description,
    };

    await pool.query('INSERT INTO blogs SET ? ', post);

    return sendResponse(res, 200, [], 'posted successful');
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, [], 'something went wrong');
  }
});

postRoute.route('/:postId').get(async (req, res) => {
  // validate id
  req.check('postId', 'postId is missing').exists().isInt();
  const errors = req.validationErrors();
  if (errors) {
    return sendResponse(res, 400, [], errors[0].msg);
  }

  const postId = parseInt(req.params.postId, 10);

  try {
    // postDetail query of post
    const query = `SELECT b.postTitle, b.description, b.createdAt as timeOfPost, u.userName
      FROM blogs b INNER JOIN users u  ON b.createdBy = u.id WHERE b.id = ?`;

      // execute query and get postDetail array
    const [postDetail] = await pool.query(query, postId);

    if (postDetail.length === 0) {
      return sendResponse(res, 404, [], 'not found');
    }

    // comments query on post
    const commentQuery = `SELECT c.id as commentId, c.comments, c.createdAt, u.userName as commentedBy, u.id AS userId FROM comments  c INNER JOIN blogs b ON c.commentedOn = b.id INNER JOIN users u ON c.commentedBy = u.id WHERE b.id = ${postId}`;

    // execute query and get comments on a particular post
    const [comments] = await pool.query(commentQuery, postId);
    postDetail[0].comments = comments;
    return sendResponse(res, 200, postDetail, 'successful');
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, [], 'internal server error');
  }
});

module.exports = postRoute;
