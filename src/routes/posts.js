const posts = require('express').Router();
const pool = require('../db');
const { sendResponse } = require('../helpers');

posts.route('/posts')
  .get(async (req, res) => {
    req.check('limit', 'limit should be int').exists().isInt().optional();
    req.check('offset', 'offset should be int').exists().isInt().optional();
    req.check('searchBy', 'searchBy should be present').exists().isLength({ min: 3 }).optional();
    req.check('keyword', 'keyword should be present').exists().isLength({ min: 3 }).optional();

    const errors = req.validationErrors();

    if (errors) {
      return sendResponse(res, 422, [], errors[0].msg);
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
        return sendResponse(res, 200, [], 'fetched all posts');
      }

      // comments query on post
      const commentQuery = `SELECT c.comments,c.commentedOn, c.createdAt, u.userName as commentedBy
      FROM comments as c 
      INNER JOIN 
      blogs 
      ON 
      c.commentedOn = blogs.id 
      INNER JOIN
      users as u 
      ON 
      c.commentedBy = u.id`;

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
  })
  .post(async (req, res) => {
    console.log(req.body);
    // validate
    req.checkBody('postTitle', 'title is missing').exists();
    req.checkBody('description', 'description is too short or missing description field').exists();

    const errors = req.validationErrors();

    if (errors) {
      return sendResponse(res, 422, [], errors[0].msg);
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

      const [blogPost] = await pool.query('INSERT INTO blogs SET ? ', post);

      return sendResponse(res, 200, blogPost, 'successful');
    } catch (err) {
      console.error(err);
      return sendResponse(res, 500, [], 'something went wrong');
    }
  });

posts.route('/posts/:id')
  .get(async (req, res) => {
    // validate id
    req.checkBody('id', 'id is missing').notEmpty();

    const id = parseInt(req.params.id);
    // const id = req.params.id;
    if (isNaN(id)) {
      return sendResponse(res, 422, [], 'invalid parameters');
    }

    try {
      // postDetail query of post
      const query = `SELECT b.postTitle, b.description, b.createdAt as timeOfPost, u.userName
      FROM 
      blogs as b 
      INNER JOIN users as u  
      ON
      b.id = u.id
      where b.id =${id}`;

      // execute query and get postDetail array
      const [postDetail] = await pool.query(query);

      if (postDetail.length === 0) {
        return sendResponse(res, 404, [], 'not found');
      }

      // comments query on post
      const commentQuery = `SELECT c.comments, c.createdAt, u.userName as commentedBy
      FROM comments as c 
      INNER JOIN 
      blogs 
      ON 
      c.commentedOn = blogs.id 
      INNER JOIN
      users as u ON c.commentedBy = u.id
      where blogs.id =${id}`;

      // execute query and get comments on a particular post
      const [comments] = await pool.query(commentQuery);
      postDetail.push(comments);
      return sendResponse(res, 200, postDetail, 'successful');
    } catch (err) {
      console.error(err);
      return sendResponse(res, 500, [], 'internal server error');
    }
  });

module.exports = posts;
