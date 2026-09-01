const axios = require('axios');

async function test() {
  try {
    console.log('Logging in as admin...');
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@fieldflow.com',
      password: 'adminpassword'
    });
    
    const token = loginRes.data.token;
    console.log('Login success. Token:', token.substring(0, 10) + '...');
    
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('\n--- Fetching Customers ---');
    const custRes = await axios.get('http://localhost:5001/api/customers', { headers });
    console.log(`Fetched ${custRes.data.length} customers.`);
    if (custRes.data.length > 0) {
      console.log('Sample Customer fields:', Object.keys(custRes.data[0]));
      console.log('Sample Customer data:', JSON.stringify(custRes.data[0], null, 2));
    }
    
    console.log('\n--- Fetching Jobs ---');
    const jobsRes = await axios.get('http://localhost:5001/api/jobs', { headers });
    console.log(`Fetched ${jobsRes.data.length} jobs.`);
    if (jobsRes.data.length > 0) {
      console.log('Sample Job fields:', Object.keys(jobsRes.data[0]));
      console.log('Sample Job data:', JSON.stringify(jobsRes.data[0], null, 2));
    }

    console.log('\n--- Fetching Technicians ---');
    const techRes = await axios.get('http://localhost:5001/api/technicians', { headers });
    console.log(`Fetched ${techRes.data.length} technicians.`);
    if (techRes.data.length > 0) {
      console.log('Sample Tech fields:', Object.keys(techRes.data[0]));
      console.log('Sample Tech data:', JSON.stringify(techRes.data[0], null, 2));
    }
    
    console.log('\n--- Fetching Inventory ---');
    const invRes = await axios.get('http://localhost:5001/api/inventory', { headers });
    console.log(`Fetched ${invRes.data.length} inventory items.`);
    if (invRes.data.length > 0) {
      console.log('Sample Inventory fields:', Object.keys(invRes.data[0]));
      console.log('Sample Inventory data:', JSON.stringify(invRes.data[0], null, 2));
    }

  } catch (error) {
    console.error('Error during test:', error.response ? error.response.data : error.message);
  }
}

test();
