const bcrypt = require('bcryptjs');

const password = 'your_desired_password';  // Replace with your desired password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
