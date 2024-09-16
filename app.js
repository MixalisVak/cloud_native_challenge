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

/* 

1. Dependency Injection (DI):
   - We are passing the database connection (`db`) into the controller functions instead of creating it inside the functions. This makes the code more organized and easier to test.

2. Don't Repeat Yourself (DRY):
   - We avoid repeating the same code by reusing functions for database queries. This helps keep the code cleaner and more maintainable.

3. Data Access Layer Abstraction:
   - Database-related logic (like queries) is separated into functions, so it's not mixed with the business logic in the controllers.

4. Error Handling:
   - Robust error handling is implemented using `try-catch` blocks in every function. Meaningful error messages and corresponding HTTP status codes (like `404 Not Found`, `500 Internal Server Error`) are returned based on the issue encountered.
   - Example: Returning `404` when an article is not found, or `500` when a server error occurs.

5. Secure Coding Practices:
   - User input is properly validated (e.g., for article creation and updates), and the application makes use of secure libraries like `jsonwebtoken` for authentication and `bcryptjs` for password hashing.
   - Example: JWT tokens are securely signed with a secret (`JWT_SECRET`), and passwords are hashed before being stored in the database.

6. Configuration Management:
   - Sensitive information like database credentials and JWT secrets are externalized in environment variables using the `.env` file and accessed via `process.env`. This keeps them out of the codebase and prevents hardcoding secrets.
   - Example: `.env` file contains `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `JWT_SECRET`.

*/