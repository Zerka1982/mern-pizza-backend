# Getting Started with Create Backend App

In this project I am using many libraries to implement Pizza Order application.

1- bcrypt (^5.1.1):

Bcrypt is a library used for hashing passwords. It employs a salted hash function to securely store passwords, making it difficult for attackers to reverse-engineer the original password.
cors (^2.8.5):

2- Cross-Origin Resource Sharing (CORS) is a security feature implemented on the client-side web browsers. The CORS package for Node.js allows or restricts access to resources on a web page from another domain.
crypto (^1.0.1):

3- The crypto module provides cryptographic functionality, including a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions. It is commonly used for secure data encryption and decryption.
dotenv (^16.3.1):

4- Dotenv is a zero-dependency module that loads environment variables from a .env file into the process.env object in Node.js applications. It helps manage configuration settings in a more organized way.
express (^4.18.2):

5- Express is a fast, unopinionated, minimalist web framework for Node.js. It simplifies the process of building web applications by providing a set of features and tools for handling routes, requests, and responses.
joi (^17.11.0):

6- Joi is a validation library for JavaScript objects. It is commonly used in Node.js applications to validate and sanitize input data, ensuring that it meets specific criteria or constraints.
jsonwebtoken (^9.0.2):

7- JsonWebToken (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. The jsonwebtoken library is used to create and verify JWTs, commonly employed for user authentication and authorization.
mongoose (^7.5.2):

8- Mongoose is an object modeling tool for MongoDB and Node.js. It provides a schema-based solution to model application data, including support for validation, query building, and middleware.
nodemailer (^6.9.7):

9- Nodemailer is a module for Node.js applications that simplifies the sending of emails. It supports various transport methods (SMTP, sendmail, etc.) and provides a convenient API for email-related tasks.
nodemon (^3.0.1):

10- Nodemon is a utility that monitors for changes in files in a Node.js application and automatically restarts the server when changes are detected. It is commonly used during development to streamline the development workflow.

11- router (^1.3.8):

The term "router" is generic, and without more context on the specific router library being used, it's challenging to provide a precise definition. Routers in Node.js typically handle route management, directing incoming requests to the appropriate handlers.
stripe (^13.8.0):

12- Stripe is a payment processing platform. The Stripe package for Node.js allows developers to integrate Stripe's services into their applications, enabling payment processing and management.
swagger-jsdoc (^6.2.8):

13- swagger-jsdoc is a tool that helps in generating Swagger/OpenAPI documentation from JSDoc comments in JavaScript files. It simplifies the process of documenting API endpoints and their parameters.
swagger-ui-express (^5.0.0):

14- Swagger UI Express is a middleware for Express applications that serves Swagger UI. Swagger UI is a tool that visualizes and interacts with the API documentation provided by Swagger/OpenAPI.
uuid (^9.0.1):

15- UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across both space and time. The uuid package provides a simple way to generate these unique identifiers in Node.js applications.

16- MongoDB Atlas is a cloud-based database service provided by MongoDB, Inc. It offers a fully managed and scalable MongoDB database solution, allowing developers to deploy, manage, and scale MongoDB databases without the need to handle the operational aspects of database administration.

## npm install

In the project directory, you can run: npm install in order to install all dependencies.

### `npm start`

This command line it to start the backend with nodemon. 

Runs the app in the development mode.\
Open [http://localhost:5000](http://localhost:5000) 


