const posts = require('express').Router();
const pool = require('../db');
const {sendResponse} = require('../helpers');

posts.route('/posts')
  .get(async(req, res) => {
    try{
      const [data] = await pool.query('SELECT post_title, description, userName, createdAt from blogs INNER JOIN users on blogs.id= users.id ');
      // console.log(data);
      if(data.length === 0){
        return sendResponse(res, 404, [], 'not found');
      } 
      return sendResponse(res, 200, data, 'successful');
    } 
  
    catch(err){
      console.log(err);
      return sendResponse(res, 500, [], 'internal server error');
    }
  })

  .post(async (req, res) => {
    //check the loggedin user
  })

posts.route('/post/:id')
  .get(async (req, res) => {

  req.checkBody('id', 'id is missing').exists();
  
    const id = parseInt(req.params.id);
    // const id = req.params.id;
    if(isNaN(id)){
      return console.log('error');
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
    }
  })
module.exports = posts;