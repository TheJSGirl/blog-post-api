# List of end points

## General APIs

### Register / Login

### POST /api/register : Create a new account
**Request Body** - userName, email, password
<br>**Note:** username/password should be minimum 5 chars long
``` javascript 
{
  "userName" : "john",
  "email" : "john2131@gmail.com",
  "password" : "12345"
}
  ```
**Response from API :**
``` javascript
{
  "status": "success",
  "data": [],
  "message": "Registration successful, please go to /login"
}
```

### POST /api/login : Login with credentials
**Request Body** : userName and password
  
``` javascript
{
  "userName" : "john" ,
  "password" : "12345"
}
```

**Response from API :**
``` javascript 
{
  "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJUeXBlIjoxLCJpYXQiOjE1MTA5Mzg3MTEsImV4cCI6MTUxMDk0MjMxMX0.pQXZNOKxyL2r9k6zAzWViCU3osyKQr_kvnee71vtSvg"
  },
  "status": "success",
  "message": "login successful"
}
```

**Note :** You have to use this token in the header with key ```x-auth``` to be able to access protected routes

<hr>

## Create / Read Posts

### POST /api/posts : Create a new blog post
**HEADER**
```javascript 
{ "x-auth" : "XXXXXX" // JWT token get when you logged in}
```

**Request Body** : postTitle and description
``` javascript
{
  "postTitle" : "programming" ,
  "description" : "some dummy text"
}
```

**Response from API :**
``` javascript
{
  "status": "success",
  "data": [],
  "message": "posted successful"
}
```

### GET /api/posts : GET all the posts

**Note:** this endpoint contains params. 
- If you want posts in limit then sent 2 query params like : 
  - /api/posts?limit=5&offset=5
- If you want to search for posts by userName name, the endpoint will be like:
  - /api/posts?searchBy=userName&keyword=john

**Response from API :**
``` javascript
{
"status": "success",
"data": [
    {
        "id": 8,
        "postTitle": "Programming",
        "description": "A programming language is, as the name would suggest, a language developed to express programs. All computers have a native programming language that they understand, commonly referred to as machine code. ",
        "author": "bail",
        "createdAt": "2017-11-16T10:33:49.000Z",
        "comments": [],
        "commentCount": 0
    },
    {
        "id": 9,
        "postTitle": "Programming",
        "description": "An interpreted program is stored in a human-readable form. When the program is executed, an interpreter modifies the human-readable content as it is run. This is analogous to the role that a human interpreter performs.",
        "author": "bail",
        "createdAt": "2017-11-16T10:34:14.000Z",
        "comments": [
            {
                "comments": "its a fabolus post",
                "commentedOn": 9,
                "createdAt": "2017-11-16T11:43:17.000Z",
                "commentedBy": "bail"
            }
            "commentCount": 2
            }
              ],
"message": "successful"
} 
```

### GET /api/posts/:postId : Get details of particular post

**HEADER**
```javascript 
{ "x-auth" : "XXXXXX" // JWT token get when you logged in}
```
**Request Body** : Nothing required

**Response from API :**
```javascript
{
    "status": "success",
    "data": [
        {
            "postTitle": "Programming",
            "description": "A programming language is, as the name would suggest, a language developed to express programs. All computers have a native programming language that they understand, commonly referred to as machine code. ",
            "timeOfPost": "2017-11-16T10:54:43.000Z",
            "userName": "bail",
            "comments": [
                {
                    "comments": "i will folow this link",
                    "createdAt": "2017-11-16T19:40:19.000Z",
                    "commentedBy": "bail",
                    "userId": 6
                },
                {
                    "comments": "awsome awsome awsome",
                    "createdAt": "2017-11-17T07:03:04.000Z",
                    "commentedBy": "bail",
                    "userId": 6
                }
            ]
        }
    ],
    "message": "successful"
}
```
<hr> 

## Adding comments to posts

### POST /api/posts/postId/comments : Add a comment on a post
**HEADER**
```javascript 
{ "x-auth" : "XXXXXX" // JWT token get when you logged in}
```
  
**Request Body** :
```javascript
{
  "comment" : "sample comment"
}
```
**Response from API :**
``` javascript
{
  "status": "success",
  "data": [],
  "message": "commented on post"
} 
```
<hr>


## APIs for **ADMIN**

### PATCH /api/admin/posts/:postId
  params - postId
  **HEADER**
```javascript 
{ "x-auth" : "XXXXXX" // JWT token get when you logged in}
```
  
**Request Body** :
```javascript
{
  "postTitle" : "sample postTitle",
  "description" : "description about post"
}
```
**Response from API :**
``` javascript
{
    "status": "success",
    "data": [],
    "message": "updated successfully"
}
```
<hr>
     

### DELETE /api/admin/posts/:postId
  params - postId
**HEADER**
```javascript 
{ "x-auth" : "XXXXXX" // JWT token get when you logged in}
```
  
**Request Body** : Nothing required
**Response from API :**
``` javascript
{
    "status": "success",
    "data": [],
    "message": "deleted successfully"
}
```
<hr>

### DELETE /api/admin/posts/:postId/comments/:commentId
  params - commentId
**HEADER**
```javascript 
{ "x-auth" : "XXXXXX" // JWT token get when you logged in}
```
  
**Request Body** : Nothing required
**Response from API :**
``` javascript
{
    "status": "success",
    "data": [],
    "message": "comment deleted successfully"
}
```
<hr>