const express = require('express');
const router = express.Router();
const Pizza = require('../models/pizzaModel'); // Import the Pizza model

// GET ALL PIZZA || GET REQUEST
router.get('/getallpizzas', async (req, res) => {
    try {
        // Fetch all pizzas from the database
        const pizzas = await Pizza.find({});
        res.send(pizzas);
    } catch (error) {
        // Handle errors and send an error response
        res.status(400).json({ message: error });
    }
});

// POST: Add a new pizza
router.post('/addpizza', async (req, res) => { 
    const { pizza } = req.body; // Extract pizza data from the request body
    try {
        // Create a new pizza based on the request data and save it to the database
        const newPizza = new Pizza({
            name: pizza.name,
            image: pizza.image,
            size: ["small", "medium", "large"],
            description: pizza.description,
            category: pizza.category,
            prices: [pizza.prices],
        });

        await newPizza.save();
        res.status(201).send("New pizza added");
    } catch (error) {
        // Handle errors and log them
        console.log(error);
    }
});

// POST: Get pizza by its ID
router.post('/getpizzabyid', async (req, res) => {
    const pizzaId = req.body.pizzaId; // Extract the pizza ID from the request body
    try {
        // Find and send the pizza with the specified ID
        const pizza = await Pizza.findOne({ _id: pizzaId });
        res.send(pizza);
    } catch (error) {
        // Handle errors and send an error response
        res.json({ message: error });
    }
});

// PUT: Update an existing pizza
router.put('/updatepizza', async (req, res) => {
    const updatedPizza = req.body.updatedPizza; // Extract the updated pizza data from the request body
            console.log(updatedPizza);  
    try {
        // Find the pizza to update by its ID and update its properties
        const pizza = await Pizza.findOne({ _id: updatedPizza._id });
        pizza.name = updatedPizza.name;
        pizza.image = updatedPizza.image;
        pizza.description = updatedPizza.description;
        pizza.category = updatedPizza.category;
        pizza.prices = updatedPizza.prices;
        await pizza.save();
        res.status(200).send('Pizza has been updated successfully!');
    } catch (error) {
        // Handle errors and send an error response
        res.status(400).json({ message: error });
    }
});

// DELETE: Delete a pizza by its ID
router.delete('/deletepizza/:pizzaId', async (req, res) => {
    const pizzaId = req.params.pizzaId; // Extract the pizza ID from the route parameter

    try {
        // Find and delete the pizza with the specified ID
        await Pizza.findOneAndDelete({ _id: pizzaId });
        res.status(200).send('Pizza deleted');
    } catch (error) {
        // Handle errors and send an error response
        res.status(404).json({ message: error });
    }
});

module.exports = router;
