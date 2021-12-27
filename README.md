# Node.js + MongoDB + Express.js - Simple API for Authentication, Registration and User Management 
# Project Description
In this project we'll go through an example Node.js, Express.js and MongoDB API that supports user registration, login with JWT authentication and user management. For an extended example that includes refresh token.
The API is written in Typescript for NodeJS and requires MongoDB to be running. Mongoose is used to connect to MongoDB, define the database schema and read/write data. Express is used as the web server.
# Table of Contents
•	Install Node.js and MongoDB <br>
•	Running the project API locally <br>
•	Testing the API with Postman <br>
# Install Node.js and MongoDb
•	Install Node.js and NPM, when you install the Node.js NPM install automatically:    https://nodejs.org/en/download/ <br>
•	Install MongoDB Community Server from:   https://www.mongodb.com/try/download/community <br>
•	Run MongoDB : https://docs.mongodb.com/manual/administration/install-community/ <br>
# Running the project API locally
•	Please clone or download the project from this link : https://github.com/RajabMohammadi/user-management <br>
•	Run <code>npm install</code> from the command line in the project root folder <br>
•	Start the API by running npm run dev from the command line in the project root folder, you should see the messages <code>Server running at http://localhost:3000</code> and <code>connected to mongodb</code> <br>
# Testing the API with Postman
<b>Sign Up New User</b>
![Sign Up](https://user-images.githubusercontent.com/42802034/147481985-1e089879-ce72-489b-9d45-e45f533212ed.jpg)
<b>Login User</b>
![login-user](https://user-images.githubusercontent.com/42802034/147482979-f1fac08b-d83a-4142-8d75-a68210019f2f.jpg)
<b>Upate User</b>
![update-user](https://user-images.githubusercontent.com/42802034/147483356-4e2c2e6e-7a3d-4b4f-806b-a8da229b776c.jpg)
<b>Get User</b>
![get-user](https://user-images.githubusercontent.com/42802034/147483473-6f9bdabe-5b92-4971-9ef7-0bd8e655fa68.jpg)
<b>Refresh Token</b>
![refresh-token](https://user-images.githubusercontent.com/42802034/147483515-68a6d997-f75d-41ef-b6a4-fcedd64f7c09.jpg)
Note: You can get the refresh token from login user request.










