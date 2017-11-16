const signUp = require('express').Router();
const pool = require('../db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sendResponse = require('../helpers/sendResponse');


signUp.route('/')
  .post(async (req, res) => {
    const {userName, email, password} =  req.body;

    //validate by using express-validator
    req.checkBody('userName', 'must required userName').notEmpty().isLength({min: 5});
    req.checkBody('email', 'invalid email').notEmpty().isEmail();
    req.checkBody('password', 'too short password').notEmpty().isLength({min:5});

    let errors = req.validationErrors();
    
    if(errors){
          return sendResponse(res, 422, [], errors[0].msg);
        }

    try{
      const hashedPassword = await bcrypt.hash(password, 10);
      userDetail = {
        userName,
        email,
        password: hashedPassword
      }
      const [data] = await pool.query('INSERT INTO users SET ? ', userDetail);

      //check is data is not exists
      if(!data){
        return sendResponse(res, 404, [], 'not found');
      }

      //check [data] length 
      if(data.length === 0){
        return sendResponse(res, 404, [], 'not found');
      }
      

      return sendResponse(res, 200, data, 'inserted successfully');
    }
    catch(err){
      console.log(err);
      if(err.code === "ER_DUP_ENTRY"){
        return sendResponse(res, 409, [], 'email already exist');
      }

      return sendResponse(res, 500, [], 'failed', 'something went wrong');
    }
    
  })

module.exports = signUp;