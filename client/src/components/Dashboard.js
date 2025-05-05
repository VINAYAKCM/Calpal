import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';

// Food database with nutritional information
const FOOD_DATABASE = {
  // North Indian Dishes
  'Roti': { calories: 71, protein: 2.7, carbs: 13.6, fat: 0.4, unit: '1 piece' },
  'Naan': { calories: 262, protein: 9.1, carbs: 45.6, fat: 5.7, unit: '1 piece' },
  'Paratha': { calories: 297, protein: 5.9, carbs: 45.4, fat: 9.2, unit: '1 piece' },
  'Dal Makhani': { calories: 140, protein: 6.5, carbs: 15.2, fat: 6.3, unit: '100g' },
  'Butter Chicken': { calories: 190, protein: 18.5, carbs: 3.2, fat: 11.2, unit: '100g' },
  'Paneer Tikka': { calories: 120, protein: 8.5, carbs: 2.3, fat: 8.7, unit: '100g' },
  'Chole Bhature': { calories: 350, protein: 10.2, carbs: 45.6, fat: 15.3, unit: '1 serving' },
  'Rajma Chawal': { calories: 280, protein: 9.8, carbs: 45.2, fat: 5.6, unit: '1 serving' },
  'Aloo Paratha': { calories: 320, protein: 7.2, carbs: 48.3, fat: 10.5, unit: '1 piece' },
  'Samosa': { calories: 262, protein: 3.8, carbs: 31.2, fat: 13.2, unit: '1 piece' },
  'Gulab Jamun': { calories: 150, protein: 2.1, carbs: 25.3, fat: 5.2, unit: '1 piece' },
  'Jalebi': { calories: 180, protein: 1.2, carbs: 35.6, fat: 4.8, unit: '100g' },

  // South Indian Dishes
  'Idli': { calories: 39, protein: 2.2, carbs: 7.8, fat: 0.2, unit: '1 piece' },
  'Dosa': { calories: 133, protein: 3.9, carbs: 25.6, fat: 2.6, unit: '1 piece' },
  'Vada': { calories: 147, protein: 4.2, carbs: 18.3, fat: 6.2, unit: '1 piece' },
  'Sambar': { calories: 80, protein: 3.2, carbs: 12.5, fat: 2.1, unit: '100g' },
  'Coconut Chutney': { calories: 45, protein: 0.8, carbs: 2.3, fat: 4.1, unit: '30g' },
  'Upma': { calories: 150, protein: 3.5, carbs: 25.6, fat: 3.2, unit: '100g' },
  'Pongal': { calories: 180, protein: 4.2, carbs: 30.5, fat: 4.8, unit: '100g' },
  'Bisi Bele Bath': { calories: 220, protein: 5.6, carbs: 35.2, fat: 6.8, unit: '100g' },
  'Rasam': { calories: 35, protein: 1.2, carbs: 6.5, fat: 0.5, unit: '100g' },
  'Medu Vada': { calories: 147, protein: 4.2, carbs: 18.3, fat: 6.2, unit: '1 piece' },
  'Puttu': { calories: 120, protein: 2.8, carbs: 25.6, fat: 0.8, unit: '100g' },
  'Appam': { calories: 85, protein: 1.8, carbs: 16.5, fat: 1.2, unit: '1 piece' },

  // Common Indian Ingredients
  'Rice': { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, unit: '100g' },
  'Curd': { calories: 60, protein: 3.1, carbs: 4.7, fat: 3.3, unit: '100g' },
  'Ghee': { calories: 900, protein: 0, carbs: 0, fat: 100, unit: '100g' },
  'Paneer': { calories: 265, protein: 18.3, carbs: 1.2, fat: 20.8, unit: '100g' },
  'Lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, unit: '100g' },
  'Coconut': { calories: 354, protein: 3.3, carbs: 15.2, fat: 33.5, unit: '100g' },

  // Chicken Breast: { calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
  // Brown Rice: { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, unit: '100g' },
  // Broccoli: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, unit: '100g' },
  // Egg: { calories: 70, protein: 6, carbs: 0.6, fat: 5, unit: '1 piece' },
  // Banana: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, unit: '1 piece' },
  // Apple: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, unit: '1 piece' },
  // Milk: { calories: 42, protein: 3.4, carbs: 4.8, fat: 1, unit: '100ml' },
  // Bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2, unit: '100g' },
  // Salmon: { calories: 208, protein: 20, carbs: 0, fat: 13, unit: '100g' },
  // Avocado: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, unit: '100g' }
};

function Dashboard({ bmiData }) {
  const [mealData, setMealData] = useState({
    food: '',
    quantity: '',
    unit: 'g',
    calories: '',
    mealType: 'Breakfast',
    date: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  });
  const [foodSuggestions, setFoodSuggestions] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [dailyTarget, setDailyTarget] = useState(2000);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [meals, setMeals] = useState([]);
  const [badges, setBadges] = useState({
    calorieGoals: 0,    // Days hit calorie goals
    mealLogging: 0,     // Number of meals logged
    consistency: 0      // Consecutive days of logging
  });
  const [lastAddedMealId, setLastAddedMealId] = useState(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const prevProgressRef = useRef(0);
  const navigate = useNavigate();

  // Load saved data on component mount
  useEffect(() => {
    const savedMeals = localStorage.getItem('meals');
    const savedCalories = localStorage.getItem('consumedCalories');
    const savedBadges = localStorage.getItem('badges');
    const lastLoginDate = localStorage.getItem('lastLoginDate');

    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedCalories) setConsumedCalories(Number(savedCalories));
    if (savedBadges) setBadges(JSON.parse(savedBadges));

    // Check for consecutive days
    const today = new Date().toDateString();
    if (lastLoginDate) {
      const lastLogin = new Date(lastLoginDate);
      const dayDifference = Math.floor((new Date() - lastLogin) / (1000 * 60 * 60 * 24));
      if (dayDifference === 1) {
        // User logged in on consecutive day
        updateBadges('consistency', 1);
      } else if (dayDifference > 1) {
        // Reset consistency if user missed a day
        setBadges(prev => ({ ...prev, consistency: 0 }));
      }
    }
    localStorage.setItem('lastLoginDate', today);
  }, []);

  useEffect(() => {
    // Calculate recommended daily calories based on BMI, gender, age
    const calculateDailyTarget = () => {
      const { weight, height, age, gender } = bmiData;
      let bmr;
      
      if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }

      const bmi = parseFloat(bmiData.bmi);
      let activityFactor = 1.2;
      
      if (bmi < 18.5) {
        setDailyTarget(Math.round(bmr * activityFactor * 1.2));
      } else if (bmi >= 25) {
        setDailyTarget(Math.round(bmr * activityFactor * 0.8));
      } else {
        setDailyTarget(Math.round(bmr * activityFactor));
      }
    };

    calculateDailyTarget();
  }, [bmiData]);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
    localStorage.setItem('consumedCalories', consumedCalories.toString());
    localStorage.setItem('badges', JSON.stringify(badges));
  }, [meals, consumedCalories, badges]);

  const updateBadges = (type, value) => {
    setBadges(prev => ({
      ...prev,
      [type]: prev[type] + value
    }));
  };

  const handleFoodInput = (e) => {
    const value = e.target.value;
    setMealData(prev => ({ ...prev, food: value }));
    
    if (value.length > 1) {
      const suggestions = Object.keys(FOOD_DATABASE)
        .filter(food => food.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setFoodSuggestions(suggestions);
    } else {
      setFoodSuggestions([]);
    }
  };

  const handleFoodSelect = (food) => {
    setMealData(prev => ({ ...prev, food }));
    setSelectedFood(FOOD_DATABASE[food]);
    setFoodSuggestions([]);
  };

  const handleQuantityChange = (e) => {
    const quantity = parseFloat(e.target.value);
    setMealData(prev => ({ ...prev, quantity }));
    
    if (selectedFood && quantity) {
      let calculatedCalories;
      if (selectedFood.unit === '100g') {
        calculatedCalories = (selectedFood.calories * quantity) / 100;
      } else if (selectedFood.unit === '1 piece') {
        calculatedCalories = selectedFood.calories * quantity;
      } else if (selectedFood.unit === '100ml') {
        calculatedCalories = (selectedFood.calories * quantity) / 100;
      }
      setMealData(prev => ({ ...prev, calories: Math.round(calculatedCalories) }));
    }
  };

  const handleDateChange = (e) => {
    setMealData(prev => ({ ...prev, date: e.target.value }));
  };

  const handleMealLog = (e) => {
    e.preventDefault();
    if (!mealData.food || !mealData.quantity || !mealData.calories) {
      alert('Please fill in all fields');
      return;
    }
    const newMeal = {
      ...mealData,
      id: Date.now(),
      timestamp: new Date(mealData.date + 'T' + new Date().toTimeString().slice(0,8)), // Use selected date, current time
      nutritionalInfo: selectedFood
    };
    setMeals(prev => [...prev, newMeal]);
    setLastAddedMealId(newMeal.id);
    const newCalories = consumedCalories + Number(mealData.calories);
    setConsumedCalories(newCalories);
    updateBadges('mealLogging', 1);
    if (newCalories >= dailyTarget * 0.9 && newCalories <= dailyTarget * 1.1) {
      updateBadges('calorieGoals', 1);
    }
    setMealData({
      food: '',
      quantity: '',
      unit: 'g',
      calories: '',
      mealType: 'Breakfast',
      date: new Date().toISOString().slice(0, 10)
    });
    setSelectedFood(null);
  };

  // Calculate remaining calories
  const remainingCalories = dailyTarget - consumedCalories;
  const calorieProgress = (consumedCalories / dailyTarget) * 100;

  // Animate the progress circle
  useEffect(() => {
    let frame;
    const duration = 800; // ms
    const start = performance.now();
    const from = prevProgressRef.current;
    const to = calorieProgress;
    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = from + (to - from) * progress;
      setAnimatedProgress(value);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        prevProgressRef.current = to;
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [calorieProgress]);

  useEffect(() => {
    if (!bmiData) {
      navigate('/onboarding');
    }
  }, [bmiData, navigate]);

  if (!bmiData) return null; // Prevents destructuring or rendering until redirect

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#212E28] to-[#020202] text-white">
      {/* Header Bar */}
      <div className="w-full flex justify-between items-center px-8 pt-8 mb-8 animate-fadeinup">
        <h1 className="text-3xl font-light font-['Instrument_Serif']">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/history')}
            className="bg-white text-[#212E28] py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors font-['Instrument_Serif']"
          >
            View History
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-['Instrument_Serif']">
            VC
          </div>
        </div>
      </div>
      <div className="max-w-6xl flex gap-8 pl-8 animate-fadeinup">
        {/* Left Side - Recent Meals */}
        <div className="w-[260px] flex-shrink-0 animate-fadeinup">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-['Instrument_Serif']">Today's Meals</h2>
            <span className="ml-2 flex items-center gap-1">
              <span className="text-lg font-['Instrument_Serif']">:</span>
              <input
                type="date"
                name="date"
                value={mealData.date}
                onChange={handleDateChange}
                className="w-32 p-1 text-sm bg-transparent border border-gray-500 rounded-md focus:outline-none focus:border-white font-['Instrument_Serif'] text-left ml-1"
                required
              />
            </span>
          </div>
          <div className="space-y-3">
            {meals.filter(meal => {
              const today = new Date().toDateString();
              return new Date(meal.timestamp).toDateString() === today;
            }).map(meal => (
              <div
                key={meal.id}
                className={`bg-white bg-opacity-10 p-4 rounded-lg border border-gray-700 transition-all duration-500 ${meal.id === lastAddedMealId ? 'animate-slidein' : 'animate-fadeinup'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium font-['Instrument_Serif']">{meal.food}</span>
                    <span className="text-sm text-gray-300 ml-2">({meal.mealType})</span>
                  </div>
                  <span className="text-lg font-['Instrument_Serif']">{meal.calories} kcal</span>
                </div>
                {meal.nutritionalInfo && (
                  <div className="mt-2 text-sm text-gray-300">
                    <div className="grid grid-cols-3 gap-2">
                      <span>Protein: {meal.nutritionalInfo.protein}g</span>
                      <span>Carbs: {meal.nutritionalInfo.carbs}g</span>
                      <span>Fat: {meal.nutritionalInfo.fat}g</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div className="flex-1 animate-fadeinup">
          {/* Daily Target Circle with Progress */}
          <div className="flex justify-center mb-16 animate-fadeinup">
            <div className="relative w-48 h-48 animate-fadeinup">
              {/* Progress circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="stroke-current text-gray-700"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="stroke-current text-white"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * animatedProgress) / 100}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-sm">Daily Target</div>
                <div className="text-3xl font-bold">{remainingCalories}</div>
                <div className="text-sm">kcal left</div>
              </div>
            </div>
          </div>

          {/* Meal Logging Form */}
          <form onSubmit={handleMealLog} className="mb-16 animate-fadeinup">
            <div className="grid grid-cols-3 gap-6">
              <div className="relative">
                <label className="block text-sm mb-2 font-['Instrument_Serif']">Food</label>
                <input
                  type="text"
                  name="food"
                  value={mealData.food}
                  onChange={handleFoodInput}
                  placeholder="Enter food name"
                  className="w-full bg-transparent border border-gray-600 rounded-md p-2 focus:outline-none focus:border-white"
                  required
                />
                {foodSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-[#1A2420] border border-gray-600 rounded-md">
                    {foodSuggestions.map((food, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-[#212E28] cursor-pointer"
                        onClick={() => handleFoodSelect(food)}
                      >
                        {food}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm mb-2 font-['Instrument_Serif']">Quantity</label>
                <div className="flex">
                  <input
                    type="number"
                    name="quantity"
                    value={mealData.quantity}
                    onChange={handleQuantityChange}
                    placeholder="Enter quantity"
                    className="w-full bg-transparent border border-gray-600 rounded-l-md p-2 focus:outline-none focus:border-white"
                    required
                  />
                  <select
                    name="unit"
                    value={mealData.unit}
                    onChange={(e) => setMealData(prev => ({ ...prev, unit: e.target.value }))}
                    className="bg-transparent border border-gray-600 border-l-0 rounded-r-md p-2 focus:outline-none focus:border-white"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 font-['Instrument_Serif']">Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={mealData.calories}
                  readOnly
                  className="w-full bg-transparent border border-gray-600 rounded-md p-2 focus:outline-none focus:border-white"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-sm mb-2 font-['Instrument_Serif']">Meal type</label>
                <select
                  name="mealType"
                  value={mealData.mealType}
                  onChange={(e) => setMealData(prev => ({ ...prev, mealType: e.target.value }))}
                  className="w-full bg-transparent border border-gray-600 rounded-md p-2 focus:outline-none focus:border-white"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-[#212E28] py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors mt-6 font-['Instrument_Serif']"
            >
              Log meal
            </button>
          </form>

          {/* Badge Tracker */}
          <div className="text-center animate-fadeinup">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px bg-white flex-1"></div>
              <h2 className="text-xl font-['Instrument_Serif']">Badge Tracker</h2>
              <div className="h-px bg-white flex-1"></div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {/* Calorie Goals */}
              <div>
                <h3 className="mb-4 text-sm font-['Instrument_Serif']">Calorie Goals</h3>
                <div className="inline-grid grid-cols-6 gap-[2px]">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 border border-gray-500 ${
                        i < badges.calorieGoals ? 'bg-white border-white' : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              {/* Meal Logging */}
              <div>
                <h3 className="mb-4 text-sm font-['Instrument_Serif']">Meals Logged</h3>
                <div className="inline-grid grid-cols-6 gap-[2px]">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 border border-gray-500 ${
                        i < badges.mealLogging ? 'bg-white border-white' : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              {/* Consistency */}
              <div>
                <h3 className="mb-4 text-sm font-['Instrument_Serif']">Daily Streak</h3>
                <div className="inline-grid grid-cols-6 gap-[2px]">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 border border-gray-500 ${
                        i < badges.consistency ? 'bg-white border-white' : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replace Settings Icon with ChatBot */}
      <ChatBot userStats={bmiData} />

      <style jsx global>{`
      @keyframes slidein {
        0% { opacity: 0; transform: translateX(-60px); }
        80% { opacity: 1; transform: translateX(8px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      .animate-slidein {
        animation: slidein 0.7s cubic-bezier(0.23, 1, 0.32, 1);
      }
      @keyframes fadeinup {
        0% { opacity: 0; transform: translateY(24px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeinup {
        animation: fadeinup 0.7s cubic-bezier(0.23, 1, 0.32, 1);
      }
      `}</style>
    </div>
  );
}

export default Dashboard; 