const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
global.crypto = require('crypto')
require('dotenv').config()

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

// This router is used to register a new user to the DB [name, email, password]
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Read and embed the image
    // Determine the full path to the image file relative to the current script
    const imageRelativePath = 'client/src/assets/images/small-preview.png';
    const imagePath = path.join(__dirname, '..', imageRelativePath);

    // Read and embed the image
    const image = fs.readFileSync(imagePath);
    const imageBase64 = image.toString('base64');

    // Send a confirmation email to the user
    const mailOptions = {
      from: 'pizza-hot@gmail.com',
      to: email,
      subject: '🍕 PIZZA-HOT Registration',
      html: `<h3>Dear ${name},</h3>
            <p>We are delighted to welcome you to enjoy PIZZA-HOT 😎</p>
            <p>Your registration has been successfully completed, and we are excited to have you as a part of our community. With your new [PIZZA_HOT] account, you can now enjoy all pizzas we offer.</p>
            <p>Here's a quick overview of what you can do with your new account:</p>
            <ul>
              <li>Access your personalized dashboard.</li>
              <li>Explore our pizzas offerings.</li>
              <li>Order your delicious pizzas.</li>
              <li>Review your history orders.</li>
            </ul>
            <p>
              To get started, simply log in to your account using your registered email address and the password you chose during registration. 
              If you ever forget your password, you can easily reset it by clicking the "Forgot Password" link on the login page.
            </p>    
            <p>Thank you for choosing <b>PIZZA-HOT</b>. We look forward to serving you and providing you with the most delicious pizzas ever.</p>    
            <p>Welcome aboard, and enjoy your journey with us!</p>
            <img src="data:image/png;base64,${imageBase64}" alt="Your Image"><br>
            <b>Best regards,</b>
            <br>
            <h2>PIZZA-HOT 🍕🍕🍕</h2>
        `,
        attachments: [
          {
            filename: 'small-preview.png',
            content: image,
            cid: 'unique_cid_for_your_image',
          },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(201).send('User registered successfully');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// This router is used to login to the solution [email, password]
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    console.log(user);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const currentUser = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id
      };
      return res.json(currentUser);
    } else {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
  } else {
    return res.status(400).json({ message: 'User not found' });
  }

});

// This router is used to display all users
router.get('/getallusers', async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).send(users)
  } catch (error) {
    res.status(404).json({ message: error.stack })
  }
})

// This router is used to delete a single user based on the userId
router.delete('/deleteuser', async (req, res) => {
  const userId = req.body.userId
  try {
    await User.findOneAndDelete({ _id: userId })
    res.status(200).send("User Deleted Successfully")
  } catch (error) {
    res.status(404).json({ message: error.stack })
  }
})

// This route to generate a resetLink to be send to the user
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      // Generate a unique reset token and set it in the user document
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expiration time (1 hour)
      await user.save();

      // Read and embed the image
      // Determine the full path to the image file relative to the current script
      const imageRelativePath = 'client/src/assets/images/small-preview.png';
      const imagePath = path.join(__dirname, '..', imageRelativePath);

      // Read and embed the image
      const image = fs.readFileSync(imagePath);
      const imageBase64 = image.toString('base64');


      // Send a password reset email with a link containing the reset token
      const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        from: 'pizza-hot@gmail.com',
        to: email,
        subject: '🍕 PIZZA-HOT - Reset Password',
        html: ` <h3>Dear ${user.name},</h3>
                <p>We received a request to reset your password for your PIZZA-HOT account. If you didn't make this request, you can safely ignore this email.</p>
                <p>To reset your password, click the button below:</p><br>
                <p><a href="${resetLink}" style="text-transform: uppercase; text-decoration: none; background: #334845; color: white; padding: 15px; border-radius: 10px">Reset Password</a></p><br>
                <p>If the button above doesn't work, you can also copy and paste the following URL into your browser:</p>
                <p>${resetLink}</p>
                <p>This password reset link is valid for the next 60 minutes.</p>
                <p>If you have any questions or need assistance, please contact our support team at [pizza-hot@gmail.com].</p>
                <img src="data:image/png;base64,${imageBase64}" alt="Your Image"><br>
                <b>Best regards,</b>
                <h2>PIZZA-HOT🍕🍕🍕</h2>
              `,
        attachments: [
          {
            filename: 'small-preview.png',
            content: image,
            cid: 'unique_cid_for_your_image',
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send('An error occurred');
        } else {
          console.log('Password reset email sent: ' + info.response);
          res.status(200).send('Password reset instructions sent to your email');
          window.location.href = '/login'
        }
      });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});



// This route to reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // Read and embed the image
      // Determine the full path to the image file relative to the current script
      const imageRelativePath = 'client/src/assets/images/small-preview.png';
      const imagePath = path.join(__dirname, '..', imageRelativePath);

      // Read and embed the image
      const image = fs.readFileSync(imagePath);
      const imageBase64 = image.toString('base64');

      // Send a confirmation email to the user
      const mailOptions = {
        from: 'pizza-hot@gmail.com',
        to: user.email,
        subject: '🍕 PIZZA-HOT - Password Reset Successful',
        html: `<h3>Dear ${user.name},</h3>
              <p>Your password has been successfully reset for your PIZZA-HOT account.</p>
              <p>If you made this change, you can safely disregard this email.</p>
              <p>If you didn't reset your password, please contact our support team at [pizza-hot@gmail.com] immediately for assistance.</p> <br>
              <p>For any further questions or assistance, please don't hesitate to reach out to our support team.</p><br>
              <img src="data:image/png;base64,${imageBase64}" alt="Your Image"><br>
              <b>Best regards,</b><br>
              <h2>PIZZA-HOT 🍕🍕🍕</h2>
        `,
        attachments: [
          {
            filename: 'small-preview.png',
            content: image,
            cid: 'unique_cid_for_your_image',
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Password reset confirmation email sent: ' + info.response);
        }
      });

      res.status(200).send('Password reset successfully');
    } else {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


module.exports = router