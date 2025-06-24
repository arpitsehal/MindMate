const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration endpoint...');
    
    const testUser = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Registration failed!');
    console.log('Error:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
  }
}

// Test the endpoint
testRegistration(); 