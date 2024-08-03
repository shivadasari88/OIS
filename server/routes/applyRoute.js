const express = require('express');
const dotenv = require('dotenv').config()
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Profile = require('../models/profile'); // Adjust the path as necessary
const { Router } = express;
const cors = require('cors');

const router = Router();

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function fillForm(profileData) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://forms.gle/3N82sCRA2dQsdBX67');

  // Using specific selectors for the input fields
  console.log('Typing username:', profileData.username);
  console.log('Typing email:', profileData.email);

  await page.type('.whsOnd ', profileData.username);
  await page.type('.whsOnd ', profileData.email);
  
  // Assuming the form fields have unique selectors
 //await page.type('input[name="username"]', profileData.username);
 // await page.type('input[name="email"]', profileData.email);

  await page.click('.NPEfkd');

  await browser.close();
  console.log('Form filled and submitted');
}

router.post('/apply', async (req, res) => {
  // Retrieve a single profile from MongoDB and use it with Puppeteer
  Profile.findOne().then(profileData => {
    if (profileData) {
      fillForm(profileData); // Now passing a single profile object
    } else {
      console.log('Profile not found');
    }
  }).catch(err => {
    console.error('Error retrieving profile:', err);
  });
});

module.exports = router;
