const express = require('express')
const Pizza = require('./models/pizzaModel')
const app = express()
const db = require('./db')
app.use(express.json())
const User = require('./models/userModel')
require('dotenv').config()


const pizzasRoute = require('./routes/pizzasRoute')
const userRoute = require('./routes/userRoute')
const ordersRoute = require('./routes/ordersRoute')


// testing Swagger
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'Pizza Application - APIs',
          version: '1.0.0'
        },
        servers:[
            {
                url: 'http://localhost:5000/'
            }
        ]
      },
      apis: ['./server.js'], // files containing annotations as above
}
const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))


/************************************ USER  ************************************/
/*                           SWAGGER API REQUESTS FOR USER
*/
/************************************ USER  ************************************/

/**
 * @swagger
 *  tags:
 *   name: User Model
 *   description: api to manage users Model
 */
/**
 * @swagger
 *   components:
 *     schemas:
 *       User:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           email:
 *             type: string
 *           password:
 *             type: string
 *           isAdmin:
 *             type: boolean
 */
/**
 * @swagger
 * /api/users/getallusers: 
 *  get:
 *    summary: This api is used to check if get method (list of users) is working
 *    tags: [User Model]
 *    description: This api is used to check if GET method (list of users) is working
 *    responses:
 *      200:
 *        description: This api is used to fetch data from mongodb
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: 'models/User'
 */


/**
 * @swagger
 * /api/users/register: 
 *   post:
 *     summary: Add a new user
 *     tags: 
 *       - User Model
 *     description: Add a new user to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: New User added successfully.
 *       400:
 *         description: Bad request. Ensure all required fields are provided.
 *       500:
 *         description: Internal server error. An error occurred while adding the pizza.
 */


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User Login
 *     tags: [User Model]
 *     description: Authenticate a user using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *             required:
 *               - email
 *               - password
 *             items:
 *               $ref: '#/components/schemas/User' 
 *     responses:
 *       200:
 *         description: User successfully authenticated.
 *       401:
 *         description: Unauthorized - Invalid credentials.
 */



/**
 * @swagger
 * /api/users/deleteuser:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User Model]
 *     description: Delete a user from MongoDB by their ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found or an error occurred during deletion.
 */



/************************************ PIZZA  ************************************/
/*                           SWAGGER API REQUESTS FOR PIZZA
*/
/************************************ PIZZA  ************************************/

/**
 * @swagger
 *  tags:
 *   name: Pizza Model
 *   description: api to manage pizzas Model
 */
/**
 * @swagger
 *   components:
 *     schemas:
 *       Pizza:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           size:
 *             type: array
 *           prices:
 *             type: array
 *           category:
 *             type: string
 *           image:
 *             type: string
 *           description:
 *             type: string
 */


/**
 * @swagger
 * /api/pizzas/getallpizzas: 
 *  get:
 *    summary: This api is used to check if get method (list of pizzas) is working
 *    tags: [Pizza Model]
 *    description: This api is used to check if GET method (list of pizzas) is working
 *    responses:
 *      200:
 *        description: This api is used to fetch data from mongodb
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Pizza'
 */


/**
 * @swagger
 * /api/pizzas/getpizzabyid:
 *   post:
 *     summary: Get a pizza by ID
 *     tags: [Pizza Model]
 *     description: Retrieve a pizza from the database by its unique ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pizzaId:
 *                 type: string
 *                 description: The unique ID of the pizza to retrieve.
 *             required:
 *               - pizzaId
 *     responses:
 *       200:
 *         description: Successfully retrieved the pizza by ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pizza' # Reference to the Pizza schema
 *       404:
 *         description: Pizza not found with the specified ID.
 *       500:
 *         description: Internal server error. An error occurred while retrieving the pizza.
 */



/**
 * @swagger
 *   /api/pizzas/addpizza:
 *     post:
 *       summary: This api is used to add new pizza
 *       tags: [Pizza Model]
 *       description: This api is used to add new pizza
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Pizza'
 *     responses:
 *       201:
 *         description: New pizza added successfully.
 *       400:
 *         description: Bad request. Ensure all required fields are provided.
 *       500:
 *         description: Internal server error. An error occurred while adding the pizza.
 */


/**
 * @swagger
 *   /api/pizzas/updatepizza:
 *     put:
 *       summary: Update an existing pizza
 *       description: Update an existing pizza by its ID.
 *       tags: [Pizza Model]
 *       consumes:
 *         - application/json
 *       produces:
 *         - application/json
 *       requestBody:
 *         description: Updated pizza data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the pizza to be updated.
 *                 name:
 *                   type: string
 *                   description: The updated name of the pizza.
 *                 image:
 *                   type: string
 *                   description: The updated image URL of the pizza.
 *                 description:
 *                   type: string
 *                   description: The updated description of the pizza.
 *                 category:
 *                   type: string
 *                   description: The updated category of the pizza.
 *                 prices:
 *                   type: object
 *                   properties:
 *                     small:
 *                       type: number
 *                       description: The updated small price of the pizza.
 *                     medium:
 *                       type: number
 *                       description: The updated medium price of the pizza.
 *                     large:
 *                       type: number
 *                       description: The updated large price of the pizza.
 *               example:
 *                 _id: "pizzaId123"
 *                 name: "Updated Pizza"
 *                 image: "https://example.com/updated-image.jpg"
 *                 description: "This is an updated pizza description."
 *                 category: "Updated Category"
 *                 prices:
 *                   small: 10
 *                   medium: 14
 *                   large: 18
 *       responses:
 *         '200':
 *           description: Successfully updated the pizza.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Pizza has been updated successfully."
 *         '400':
 *           description: Bad Request. The request data is invalid.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request data."
 */

/**
 * @swagger
 * /api/pizzas/deletepizza/{pizzaId}:
 *   delete:
 *     summary: Delete a pizza
 *     tags: [Pizza Model]
 *     description: Delete a pizza from the database by its unique ID.
 *     parameters:
 *       - in: path
 *         name: pizzaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the pizza to delete.
 *     responses:
 *       200:
 *         description: Pizza deleted successfully.
 *       404:
 *         description: Pizza not found with the specified ID.
 *       500:
 *         description: Internal server error. An error occurred while deleting the pizza.
 */



app.use('/api/pizzas/', pizzasRoute)
app.use('/api/users/', userRoute)
app.use('/api/orders/', ordersRoute)

app.get('/', (req, res) => {
    res.send("Server is working..."+ process.env.PORT)
})



app.listen(process.env.PORT, () => 'Server is running on port' + process.env.PORT)