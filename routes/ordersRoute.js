const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/orderModel');
const nodemailer = require('nodemailer');

// testing image add to emails
const fs = require('fs');
const path = require('path');
// Create a nodemailer transporter with your email service provider's settings
const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
    },
});

// Stripe - secret key
const stripe = require('stripe')(process.env.STRIPE_KEY)

router.post('/placeorder', async (req, res) => {
    const { token, totalPrice, currentUser, cartItems } = req.body
    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        const payment = await stripe.charges.create({
            amount: totalPrice * 100,
            currency: 'EUR',
            customer: customer.id,
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        })
        if (payment) {
            const newOrder = new Order({
                name: currentUser.name,
                email: currentUser.email,
                userid: currentUser._id,
                orderItems: cartItems,
                orderAmount: totalPrice,
                shippingAddress: {
                    street: token.card.address_line1,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    pincode: token.card.address_zip
                },
                transactionId: payment.source.id
            })
            newOrder.save()

            res.send('Order process has completed successfully')
        } else {
            res.send('Order process has Failed!')
        }
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong' + error })
    }
})


router.post('/getuserorders', async (req, res) => {
    const { userid } = req.body
    try {
        const orders = await Order.find({ userid: userid }).sort({ _id: -1 })
        res.send(orders)
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong ' + error })
    }
})


router.get('/alluserorder', async (req, res) => {
    try {
        const orders = await Order.find({})
        res.status(200).send(orders)
    } catch (error) {
        res.status(400).json({
            message: 'Something went wrong ',
            error: error.stack
        })
    }
})

// Add a function to send an email
function sendDeliveryConfirmationEmail(email, order) {
    // Assuming that order.createdAt is a valid date string
    const orderDate = new Date(order.createdAt);

    // Add 30 minutes to the order time
    orderDate.setMinutes(orderDate.getMinutes() + 30);

    // Format the order date and time in 'HH:mm' format
    const formattedOrderTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}`;

    // Format the full order date with day, month, year, and time
    const formattedOrderDate = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getDate().toString().padStart(2, '0')}  at <b> ${formattedOrderTime}</b>`;

    // Create a new Date object for the estimated delivery time
    const estimatedDeliveryTime = new Date(orderDate);
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 30);

    // Format the estimated delivery time in 'HH:mm' format
    const formattedEstimatedDeliveryTime = `${estimatedDeliveryTime.getHours().toString().padStart(2, '0')}:${estimatedDeliveryTime.getMinutes().toString().padStart(2, '0')}`;

    // Format the full estimated delivery date with day, month, year, and time
    const formattedEstimatedDeliveryDate = `${estimatedDeliveryTime.getFullYear()}-${(estimatedDeliveryTime.getMonth() + 1).toString().padStart(2, '0')}-${estimatedDeliveryTime.getDate().toString().padStart(2, '0')} at <b> ${formattedEstimatedDeliveryTime}</b>`;


    // Read and embed the image
    // Determine the full path to the image file relative to the current script
    const imageRelativePath = 'client/src/assets/images/small-preview.png';
    const imagePath = path.join(__dirname, '..', imageRelativePath);

    // Read and embed the image
    const image = fs.readFileSync(imagePath);
    const imageBase64 = image.toString('base64');
    const mailOptions = {
        from: 'pizza-hot@gmail.com',
        to: email,
        subject: '🍕 PIZZA-HOT - Order Delivery Confirmation',
        html: `<h3>Dear ${order.name},</h3>
            <p>We are excited to inform you that your order is now ready and on its way to your home address.</p>
            <p>Here are the details of your order:</p>
            <ul>
                <li><strong>Order ID:</strong> ${order._id}</li>
                <li><strong>Order Date & Time:</strong> ${formattedOrderDate}</li>
                <li><strong>Estimated Delivery Date & Time:</strong> ${formattedEstimatedDeliveryDate}</li>
                <li><strong>Shipping Address:</strong> ${order.shippingAddress.street} ${order.shippingAddress.city} ${order.shippingAddress.pincode} <br></li> 
                <li style="margin-bottom: 30px"><strong>Order details:</strong><br>
                <table style="border-collapse: collapse; background-color: #f4f4f4; border: 1px solid #ddd; border-radius: 5px; margin-top: 30px;">
                    <thead>
                        <tr>
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Quantity</th>
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Size</th>
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Name</th>
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${order.orderItems[0].quantity}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${order.orderItems[0].size}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${order.orderItems[0].name}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;"><img src="${order.orderItems[0].image}"  alt="Order Image" style="max-width: 150px; max-height: 150px;"/></td>
                        </tr>
                    </tbody>
                </table>
                </li>
            </ul>
            <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
            <p>Thank you for choosing our service. We hope you enjoy our pizza 😎!</p>
            <img src="data:image/png;base64,${imageBase64}" alt="Your Image"><br>
            <b>Best regards,</b>
            <br>
            <h2>PIZZA-HOT 🍕🍕🍕</h2>
        `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

router.post('/deliverorder', async (req, res) => {
    const orderid = req.body.orderid;
    console.log(orderid);
    try {
        const order = await Order.findOne({ _id: orderid });
        if (!order) {
            // Order not found
            return res.status(404).json({
                message: 'Order not found',
            });
        }

        order.isDelivered = true;
        await order.save();
        // Send a delivery confirmation email asynchronously
        sendDeliveryConfirmationEmail(order.email, order);
        res.status(200).send('Order has been delivered successfully');
    } catch (error) {
        res.status(400).json({
            message: 'Something went wrong ',
            error: error.stack
        });
    }
});


router.post('/deleteorder', async (req, res) => {
    const orderId = req.body.orderId
    try {
        await Order.findOneAndDelete({ _id: orderId })
        res.status(200).send("Order Deleted Successfully")
    } catch (error) {
        res.status(404).json({ message: error.stack })
    }
})

module.exports = router