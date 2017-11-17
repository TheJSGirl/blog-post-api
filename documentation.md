# List of end points

##APIs for **BLOGGER**
* POST /api/register
  requestBody - userName, email, password 
  **requestUrl** - ``` http://localhost:3000/api/register/ ```  
  {
    ``` userName : john ```,
    ``` email : john2131@gmail.com ```,
    ``` password : 12345 ```
  }

* POST /api/login
  requestBody - userName, password
  **requestUrl** - ``` http://localhost:3000/api/login/ ```    
  {
    ``` userName : john ```,
    ``` password : 12345 ```
  }

* POST /api/users/posts
  requestBody - postTitle, description
  **requestUrl** - ``` http://localhost:3000/api/users/posts ```    
  {
    ``` postTitle : programming ```, 
    ``` description : some dummy text ```
  }

* POST /api/comments/:postId
  requestBody - comments
  params - postId
  **requestUrl** - ``` http://localhost:3000/api/comments/10 ```
  {
    ``` comments : comment on post   ```
  }

* GET /api/users/posts
  **requestUrl** - ``` http://localhost:3000/api/users/posts ```  
  
* GET /api/users/posts/:postId
  params - postId
  **requestUrl** - ``` http://localhost:3000/api/posts/1 ```    

* DELETE /api/comments/:commentId
  params - commentId
  **requestUrl** - ``` http://localhost:3000/api/comments/10 ```    

##APIs for **ADMIN**
* PATCH /api/posts/:postId
  params - postId
  **requestUrl** - ``` http://localhost:3000/api/posts/10 ```    

* DELETE /api/posts/:postId
  params - postId
  **requestUrl** - ``` http://localhost:3000/api/posts/1 ```    

* DELETE /api/comments/:commentId
  params - commentId
  **requestUrl** - ``` http://localhost:3000/api/comments/10 ```  

