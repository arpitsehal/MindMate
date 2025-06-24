const { getRow, getAll } = require('./database');
const { comparePassword } = require('./auth');

async function debugLogin() {
  try {
    console.log('🔍 Debugging login functionality...\n');
    
    // 1. Check what users exist in database
    console.log('1. Checking all users in database:');
    const allUsers = await getAll('SELECT id, first_name, last_name, email, password FROM users');
    console.log('Users found:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Password hash: ${user.password.substring(0, 20)}...`);
    });
    
    console.log('\n2. Testing login with registered email:');
    const testEmail = 'test@example.com'; // Use the email from registration test
    
    const user = await getRow(
      'SELECT id, first_name, last_name, email, password FROM users WHERE email = ?',
      [testEmail]
    );
    
    if (user) {
      console.log('✅ User found:', user.email);
      console.log('Password hash:', user.password);
      
      // Test password comparison
      const testPassword = 'password123';
      const isValidPassword = await comparePassword(testPassword, user.password);
      console.log(`Password comparison result: ${isValidPassword}`);
      
    } else {
      console.log('❌ No user found with email:', testEmail);
    }
    
    console.log('\n3. Testing with wrong email:');
    const wrongUser = await getRow(
      'SELECT id, first_name, last_name, email, password FROM users WHERE email = ?',
      ['wrong@email.com']
    );
    console.log('Wrong email result:', wrongUser ? 'Found (should be null)' : 'Not found (correct)');
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugLogin(); 