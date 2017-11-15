const signUp = require('express').Router();
const pool = require('../db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');


signUp.route('/')
  .post(async (req, res) => {
    const {userName, email, password} =  req.body;
    try{
      const hashedPassword = await bcrypt.hash(password, 10);
      userDetail = {
        userName,
        email,
        password: hashedPassword
      }
      const [data] = await pool.query('INSERT INTO users SET ?', userDetail );
    }
    catch(err){
      console.log(err);
    }
  })

module.exports = signUp;