const http = require('http');

const data = JSON.stringify({
  action: 'regenFromUpload',
  data: {
    resumeText: "John Doe\nSoftware Engineer",
    jobDescription: "Looking for a Software Engineer"
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let raw = '';
  res.on('data', (chunk) => {
    raw += chunk;
  });
  res.on('end', () => {
    console.log('RAW RESPONSE:', JSON.stringify(raw));
    
    // Simulate what the client does
    let jsonStr = raw;
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonStr = raw.substring(jsonStart, jsonEnd + 1);
    }
    
    console.log('jsonStr length:', jsonStr.length);
    console.log('jsonStr:', JSON.stringify(jsonStr.substring(0, 100)));
    
    try {
      JSON.parse(jsonStr);
      console.log('Parse successful!');
    } catch (e) {
      console.error('Parse Error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
