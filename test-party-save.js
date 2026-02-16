// Test if we can reach the API
const testEmail = 'test@example.com';
const testData = {
  email: testEmail,
  partyData: {
    childName: 'Test',
    age: 5,
    theme: 'Princess',
    step: 1
  },
  partyName: 'Test Party',
  status: 'archived'
};

fetch('https://www.planmypartypal.com/api/party/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(r => r.json())
.then(data => console.log('Response:', JSON.stringify(data, null, 2)))
.catch(err => console.error('Error:', err));
