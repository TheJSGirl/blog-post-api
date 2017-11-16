const comments = require('express').Router();
const pool = require('../db');
const {sendResponse} = require('../helpers');

comments.route('/:id')
.post(async (req, res) => {
  //validate id and comments
  req.checkBody('id', 'id is missing').exists();
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
    console.error(err);
    return sendResponse(res, 500, [], 'something went wrong');
  }
})

.delete(async(req, res) => {
  //validate id 
  req.checkBody('id', 'id is missing').notEmpty();
  const id = parseInt(req.params.id);
  const userId = req.user.userId;
  
  if(isNaN(id)){
      return sendResponse(res, 422, [], 'invalid parameters');
    }

    try{
      const [result] = await pool.query(`SELECT commentedBy FROM comments WHERE commentedOn = ${id}`);
      console.log(result[0]);
      if(userId !== result.commentedBy){
        return sendResponse(res, 400, [], 'bad request');
      }
      if(userId === 1){
        const [deletedData] = await pool.query(`DELETE FROM comments WHERE commentedOn = ${id}`);
        console.log(deletedData[0]);
      }
      const [deletedData] = await pool.query(`DELETE FROM comments WHERE commentedOn = ${id}`);
      console.log(deletedData[0]);

      return sendResponse(res, 200, deletedData, 'deletion successful');
    }
    catch(err){
      console.error(err);
    }


})

module.exports = comments;