const posts = require('express').Router();
const pool = require('../db');
const {sendResponse} = require('../helpers');

posts.route('/posts')
  .get(async(req, res) => {
    try{
      
      const [data] = await pool.query('SELECT blogs.id, post_title, description, userName, createdAt from blogs INNER JOIN users on blogs.createdBy= users.id ');
      // console.log(data);
      if(data.length === 0){
        return sendResponse(res, 404, [], 'not found');
      } 

      //comments query on post
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
    
      //execute query and get comments on a particular post
      const [comments] = await pool.query(commentQuery);
      data.push(comments);
      
      return sendResponse(res, 200, data, 'successful');
    } 
  
    catch(err){
      console.log(err);
      return sendResponse(res, 500, [], 'internal server error');
    }
  })

  .post(async (req, res) => {

      console.log(req.body);
    //validate
    req.checkBody('post_title', 'title is missing').notEmpty();
    req.checkBody('description', 'description is too short or missing description field').notEmpty()  ;

    let errors = req.validationErrors();
    
    if(errors){
      return sendResponse(res, 422, [], errors[0].msg);
    }

    try{
    //check the loggedin user
    const userId = req.user.userId;

    const {post_title, description} = req.body;
    

    //object of post
     const post = {
      post_title,
      createdBy: userId,
      description
    }

    const [blogPost] = await pool.query('INSERT INTO blogs SET ? ', post);

    return sendResponse(res, 200, blogPost, 'successful');
    }
    catch(err){
      console.log(err);
      return sendResponse(res, 500, [], 'something went wrong');
    }
  })

posts.route('/post/:id')
  .get(async (req, res) => {
    
    //validate id
    req.checkBody('id', 'id is missing').notEmpty();
  
    const id = parseInt(req.params.id);
    // const id = req.params.id;
    if(isNaN(id)){
      return sendResponse(res, 422, [], 'invalid parameters');
    }
  
    try{
      
      // postDetail query of post
      const query = `SELECT b.post_title, b.description, b.createdAt as timeOfPost, u.userName
      FROM 
      blogs as b 
      INNER JOIN users as u  
      ON
      b.id = u.id
      where b.id =${id}`;

      //execute query and get postDetail array 
      const [postDetail] = await pool.query(query);

      if(postDetail.length === 0){
        return sendResponse(res, 404, [], 'not found');
      }

      //comments query on post
      const commentQuery = `SELECT c.comments, c.createdAt, u.userName as commentedBy
      FROM comments as c 
      INNER JOIN 
      blogs 
      ON 
      c.commentedOn = blogs.id 
      INNER JOIN
      users as u ON c.commentedBy = u.id
      where blogs.id =${id}`;
    
      //execute query and get comments on a particular post
      const [comments] = await pool.query(commentQuery);
      
      postDetail.push(comments);

        return sendResponse(res, 200, postDetail, 'successful');
    }
  
    catch(err){
      console.log(err);
      return sendResponse(res, 500, [], 'internal server error');
    }
  })

  .post(async (req, res) => {
  
    //validate id and comments
    req.checkBody('id', 'id is missing').notEmpty();
    req.checkBody('comments', 'comment require').notEmpty().isAlphanumeric();
    
    
    const id = parseInt(req.params.id);
    const userId = req.user.userId;
    
    if(isNaN(id)){
        return sendResponse(res, 422, [], 'invalid parameters');
      }
    
    const { comments} = req.body;
    
    try{
      
      commentData = {
        comments,
        commentedBy: userId,
        commentedOn: id
      }

      //query to insert comment detail in db
      const [comment] = await pool.query('INSERT INTO comments SET ?', commentData);

      return sendResponse(res, 200, comment, 'commented on post');
    }

    catch(err){
      console.log(err);

    }
    

  })
module.exports = posts;