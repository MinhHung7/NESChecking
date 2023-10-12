const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter your username: ', (username) => {
  rl.question('Enter your password: ', (password) => {
    const loginData = {
      username,
      password,
    };

    axios.post('https://your-api-endpoint.com/login', loginData)
      .then(response => {
        // Successful login
        console.log('Login successful');
        console.log('Response data:', response.data);
      })
      .catch(error => {
        // Login failed
        console.error('Login failed');
        console.error('Error:', error.message);
      })
      .finally(() => {
        rl.close();
      });
  });
});
