const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const imageRoutes = require('./routes/imageRoutes');

require('dotenv').config(); // Load environment variables

const app = express();

// Use morgan for logging
app.use(morgan('tiny'));

app.use(express.json());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/articles', articleRoutes);
app.use('/api/images', imageRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
