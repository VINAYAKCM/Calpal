import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MealHistory from './components/MealHistory';
import Welcome from './Welcome';

function Onboarding({ onComplete, userName }) {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male'
  });
  const [result, setResult] = useState(null);
  const [bmiExplanation, setBmiExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchBmiExplanation = async (bmi, category) => {
    setLoadingExplanation(true);
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: `Explain in 2-3 sentences what it means for a user to have a BMI of ${bmi} (${category}). Use simple, friendly language. End with: 'No matter your BMI, CalPal will help you make healthy choices and reach your goals. You're in good hands!'`,
          stream: false
        }),
      });
      const data = await response.json();
      setBmiExplanation(data.response || '');
    } catch (error) {
      setBmiExplanation('Could not fetch explanation. Please ensure Ollama is running.');
    }
    setLoadingExplanation(false);
  };

  const calculateBMI = async (e) => {
    e.preventDefault();
    if (!formData.height || !formData.weight || !formData.age || !formData.gender) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const response = await fetch('http://localhost:5001/api/calculate-bmi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          age: parseInt(formData.age),
          gender: formData.gender
        }),
      });
      const data = await response.json();
      setResult(data);
      setBmiExplanation('');
      fetchBmiExplanation(data.bmi, data.category);
    } catch (error) {
      console.error('Error:', error);
      alert('Error calculating BMI. Please try again.');
    }
  };

  const handleNext = () => {
    onComplete({ ...formData, ...result });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#212E28] to-[#020202] flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-light text-white text-center mb-2 font-['Instrument_Serif']">
          {userName ? `Welcome, ${userName}!` : 'Set up your profile to get personalized nutrition recommendations'}
        </h1>
        <p className="text-base text-gray-300 text-center mb-8 font-['Instrument_Serif']">Please enter your details to get started with personalized nutrition tracking.</p>
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={calculateBMI} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm mb-2 font-['Instrument_Serif']">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:border-white font-['Instrument_Serif']"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2 font-['Instrument_Serif']">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:border-white font-['Instrument_Serif']"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2 font-['Instrument_Serif']">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:border-white font-['Instrument_Serif']"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2 font-['Instrument_Serif']">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:border-white font-['Instrument_Serif']"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-[#212E28] py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors mt-6 font-['Instrument_Serif']"
            >
              Set up
            </button>
          </form>
          {result && (
            <div className="mt-12 text-center">
              <div className="flex items-center justify-center space-x-4">
                <div className="h-px bg-white flex-1"></div>
                <h2 className="text-white text-xl font-['Instrument_Serif']">Your BMI</h2>
                <div className="h-px bg-white flex-1"></div>
              </div>
              <h3 className="text-white text-lg mt-2 font-['Instrument_Serif']">Levels</h3>
              <div className="mt-4 text-white">
                <p className="text-2xl font-bold font-['Instrument_Serif']">{result.bmi}</p>
                <p className="text-lg font-['Instrument_Serif']">{result.category}</p>
              </div>
              <div className="mt-6 text-white text-base font-['Instrument_Serif'] min-h-[48px]">
                {loadingExplanation ? (
                  <span className="flex justify-center items-center w-full">
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  </span>
                ) : (
                  <span>{bmiExplanation}</span>
                )}
              </div>
              <button
                className="mt-8 bg-white text-[#212E28] py-2 px-6 rounded-md font-medium hover:bg-gray-100 transition-colors font-['Instrument_Serif']"
                onClick={handleNext}
                disabled={loadingExplanation}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [bmiData, setBmiData] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('calpalUserName') || '');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding" element={<Onboarding onComplete={setBmiData} userName={userName} />} />
        <Route path="/dashboard" element={<Dashboard bmiData={bmiData} userName={userName} />} />
        <Route path="/history" element={<MealHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
