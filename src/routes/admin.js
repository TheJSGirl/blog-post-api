const admin = require('express').Router();
const {sendResponse} = require('../helpers');
const pool = require('../db');


admin.route('/:postId')
  .patch(async (req, res) => {

    //validate postId
    req.checkBody('postId', 'post id is required').notEmpty();
    const postId = parseInt(req.params.postId);

    //check if postId is not a number
    if(isNaN(postId)){
      return sendResponse(res, 422, [], 'invalid parameters');
    }

    const userId = req.user.id;
    const userType = req.user.userType;
    const {postTitle, description} = req.body;
    const updateValues = [];
    

    //check if postTitle or description is empty
    if(!postTitle && !description){
      return sendResponse(res, 422, [], 'missing parameters');
    }

    if(postTitle){
      //check postTitle length should be greater than zero if true then updateValues
      if(postTitle.length > 0){
        updateValues.push(`postTitle = '${postTitle}'`);
      }
    }


    if(description ){
      //check description length should be greater than zero if true then updateValues
      if(description.length > 0){
        updateValues.push(`description = '${description}' `);
      }
    }
    //set updateQuery
    let updateQuery = 'UPDATE blogs SET ';

    //if updateValues length is greater than zero then join both updateValues with join method
    if(updateValues.length > 0){
    updateQuery += updateValues.join();
    
    }
    //set where clause to updateQuery
    updateQuery += `WHERE id = '${postId}'`;

    // console.log(updateQuery);

    try{

      if(userType === 1){
        
        //execute query to update the fields
        const [result] = await pool.query(updateQuery);
        return sendResponse(res, 200, result, 'updated successfully');
      }
      
    }
    catch(err){
      console.log(err);
      return sendResponse(res, 500, [], 'internal server error');
    }

  })
  .delete(async (req, res) => {
    const postId = parseInt(req.params.postId);    
    
    //validate id
    req.checkBody('postId', 'missing parameters').notEmpty();

    if(isNaN(postId)){
      return sendResponse(res, 422, [], 'invalid id');
    }

    const userType = req.user.userType;

    try{
      if(userType === 1){
        const [result] = await pool.query(`DELETE FROM blogs WHERE id = ${postId}`);
        return sendResponse(res, 200, [], 'deleted successfully');
      }
    }
    catch(err){
      console.log(err);
      return sendResponse(res, 500, [], 'internal server error');
    }
  })

module.exports = admin;