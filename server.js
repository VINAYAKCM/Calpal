const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// BMI calculation endpoint
app.post('/api/calculate-bmi', (req, res) => {
  const { height, weight, age, gender } = req.body;
  
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // Calculate BMI
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Determine BMI category
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 18.5 && bmi < 25) category = 'Normal weight';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight';
  else category = 'Obese';
  
  res.json({
    bmi: bmi.toFixed(2),
    category,
    age,
    gender
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 