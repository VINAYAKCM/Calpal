import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';

// Food database with nutritional information
const FOOD_DATABASE = {
  // North Indian Dishes
  'Roti': { calories: 71, protein: 2.7, carbs: 13.6, fat: 0.4, unit: '1 piece' },
  'Naan': { calories: 262, protein: 9.1, carbs: 45.6, fat: 5.7, unit: '1 piece' },
  'Paratha': { calories: 297, protein: 5.9, carbs: 45.4, fat: 9.2, unit: '1 piece' },
  'Aloo Paratha': { calories: 320, protein: 7.2, carbs: 48.3, fat: 10.5, unit: '1 piece' },
  'Paneer Paratha': { calories: 330, protein: 10, carbs: 45, fat: 12, unit: '1 piece' },
  'Missi Roti': { calories: 120, protein: 4, carbs: 20, fat: 2, unit: '1 piece' },
  'Bhatura': { calories: 200, protein: 5, carbs: 30, fat: 7, unit: '1 piece' },
  'Dal Makhani': { calories: 140, protein: 6.5, carbs: 15.2, fat: 6.3, unit: '100g' },
  'Rajma': { calories: 120, protein: 7, carbs: 22, fat: 1, unit: '100g' },
  'Chole': { calories: 140, protein: 7, carbs: 23, fat: 2, unit: '100g' },
  'Paneer Butter Masala': { calories: 250, protein: 8, carbs: 12, fat: 18, unit: '100g' },
  'Butter Chicken': { calories: 190, protein: 18.5, carbs: 3.2, fat: 11.2, unit: '100g' },
  'Palak Paneer': { calories: 180, protein: 9, carbs: 10, fat: 12, unit: '100g' },
  'Aloo Gobi': { calories: 90, protein: 2.5, carbs: 14, fat: 3, unit: '100g' },
  'Baingan Bharta': { calories: 80, protein: 2, carbs: 10, fat: 4, unit: '100g' },
  'Kadhi Pakora': { calories: 150, protein: 5, carbs: 18, fat: 6, unit: '100g' },
  'Jeera Rice': { calories: 180, protein: 3, carbs: 36, fat: 2, unit: '100g' },
  'Pulao': { calories: 200, protein: 4, carbs: 38, fat: 3, unit: '100g' },
  'Biryani': { calories: 250, protein: 6, carbs: 40, fat: 7, unit: '100g' },
  'Chole Bhature': { calories: 350, protein: 10.2, carbs: 45.6, fat: 15.3, unit: '1 serving' },
  'Rajma Chawal': { calories: 280, protein: 9.8, carbs: 45.2, fat: 5.6, unit: '1 serving' },
  'Samosa': { calories: 262, protein: 3.8, carbs: 31.2, fat: 13.2, unit: '1 piece' },
  'Pakora': { calories: 80, protein: 2, carbs: 10, fat: 4, unit: '1 piece' },
  'Gulab Jamun': { calories: 150, protein: 2.1, carbs: 25.3, fat: 5.2, unit: '1 piece' },
  'Jalebi': { calories: 180, protein: 1.2, carbs: 35.6, fat: 4.8, unit: '100g' },
  'Kheer': { calories: 120, protein: 3, carbs: 20, fat: 3, unit: '100g' },
  'Halwa': { calories: 250, protein: 3, carbs: 40, fat: 10, unit: '100g' },
  'Lassi': { calories: 150, protein: 5, carbs: 20, fat: 5, unit: '250ml' },
  'Chai': { calories: 90, protein: 2, carbs: 15, fat: 2, unit: '200ml' },
  // South Indian Dishes
  'Idli': { calories: 39, protein: 2.2, carbs: 7.8, fat: 0.2, unit: '1 piece' },
  'Dosa': { calories: 133, protein: 3.9, carbs: 25.6, fat: 2.6, unit: '1 piece' },
  'Masala Dosa': { calories: 168, protein: 4, carbs: 27, fat: 5, unit: '1 piece' },
  'Vada': { calories: 147, protein: 4.2, carbs: 18.3, fat: 6.2, unit: '1 piece' },
  'Medu Vada': { calories: 147, protein: 4.2, carbs: 18.3, fat: 6.2, unit: '1 piece' },
  'Sambar': { calories: 80, protein: 3.2, carbs: 12.5, fat: 2.1, unit: '100g' },
  'Coconut Chutney': { calories: 45, protein: 0.8, carbs: 2.3, fat: 4.1, unit: '30g' },
  'Upma': { calories: 150, protein: 3.5, carbs: 25.6, fat: 3.2, unit: '100g' },
  'Pongal': { calories: 180, protein: 4.2, carbs: 30.5, fat: 4.8, unit: '100g' },
  'Bisi Bele Bath': { calories: 220, protein: 5.6, carbs: 35.2, fat: 6.8, unit: '100g' },
  'Rasam': { calories: 35, protein: 1.2, carbs: 6.5, fat: 0.5, unit: '100g' },
  'Puttu': { calories: 120, protein: 2.8, carbs: 25.6, fat: 0.8, unit: '100g' },
  'Appam': { calories: 85, protein: 1.8, carbs: 16.5, fat: 1.2, unit: '1 piece' },
  'Uttapam': { calories: 180, protein: 4, carbs: 35, fat: 3, unit: '1 piece' },
  'Kesari Bath': { calories: 210, protein: 3, carbs: 40, fat: 6, unit: '100g' },
  'Filter Coffee': { calories: 60, protein: 2, carbs: 10, fat: 2, unit: '150ml' },
  // West Indian Dishes
  'Dhokla': { calories: 80, protein: 3, carbs: 12, fat: 2, unit: '1 piece' },
  'Thepla': { calories: 120, protein: 3, carbs: 18, fat: 4, unit: '1 piece' },
  'Undhiyu': { calories: 180, protein: 4, carbs: 25, fat: 7, unit: '100g' },
  'Pav Bhaji': { calories: 400, protein: 8, carbs: 60, fat: 15, unit: '1 plate' },
  'Vada Pav': { calories: 290, protein: 6, carbs: 40, fat: 12, unit: '1 piece' },
  'Misal Pav': { calories: 350, protein: 10, carbs: 50, fat: 12, unit: '1 plate' },
  'Shrikhand': { calories: 200, protein: 6, carbs: 30, fat: 6, unit: '100g' },
  // East Indian Dishes
  'Litti Chokha': { calories: 300, protein: 8, carbs: 45, fat: 10, unit: '1 plate' },
  'Momos': { calories: 35, protein: 1, carbs: 6, fat: 1, unit: '1 piece' },
  'Thukpa': { calories: 120, protein: 4, carbs: 20, fat: 2, unit: '100g' },
  'Chingri Malai Curry': { calories: 180, protein: 10, carbs: 8, fat: 12, unit: '100g' },
  'Sandesh': { calories: 120, protein: 4, carbs: 18, fat: 4, unit: '1 piece' },
  'Rasgulla': { calories: 125, protein: 3, carbs: 24, fat: 3, unit: '1 piece' },
  'Mishti Doi': { calories: 150, protein: 4, carbs: 25, fat: 4, unit: '100g' },
  // Street Foods & Snacks
  'Pani Puri': { calories: 40, protein: 1, carbs: 7, fat: 1, unit: '1 piece' },
  'Bhel Puri': { calories: 150, protein: 3, carbs: 28, fat: 3, unit: '1 plate' },
  'Sev Puri': { calories: 50, protein: 1, carbs: 8, fat: 2, unit: '1 piece' },
  'Dabeli': { calories: 190, protein: 4, carbs: 30, fat: 6, unit: '1 piece' },
  'Aloo Tikki': { calories: 120, protein: 2, carbs: 20, fat: 4, unit: '1 piece' },
  'Chana Chaat': { calories: 180, protein: 7, carbs: 30, fat: 3, unit: '1 plate' },
  'Papdi Chaat': { calories: 300, protein: 6, carbs: 45, fat: 10, unit: '1 plate' },
  // Sweets
  'Barfi': { calories: 120, protein: 2, carbs: 20, fat: 5, unit: '1 piece' },
  'Motichoor Laddu': { calories: 150, protein: 2, carbs: 25, fat: 6, unit: '1 piece' },
  'Peda': { calories: 100, protein: 2, carbs: 18, fat: 3, unit: '1 piece' },
  'Rabri': { calories: 200, protein: 5, carbs: 25, fat: 10, unit: '100g' },
  // Common Indian Ingredients
  'Rice': { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, unit: '100g' },
  'Brown Rice': { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, unit: '100g' },
  'Curd': { calories: 60, protein: 3.1, carbs: 4.7, fat: 3.3, unit: '100g' },
  'Ghee': { calories: 900, protein: 0, carbs: 0, fat: 100, unit: '100g' },
  'Paneer': { calories: 265, protein: 18.3, carbs: 1.2, fat: 20.8, unit: '100g' },
  'Lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, unit: '100g' },
  'Coconut': { calories: 354, protein: 3.3, carbs: 15.2, fat: 33.5, unit: '100g' },
  'Egg': { calories: 70, protein: 6, carbs: 0.6, fat: 5, unit: '1 piece' },
  'Milk': { calories: 42, protein: 3.4, carbs: 4.8, fat: 1, unit: '100ml' },
  'Bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, unit: '100g' },
  'Banana': { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, unit: '1 piece' },
  'Apple': { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, unit: '1 piece' },
  'Orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, unit: '1 piece' },
  'Potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, unit: '100g' },
  'Tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, unit: '100g' },
  'Onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, unit: '100g' },
  'Spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, unit: '100g' },
  'Broccoli': { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, unit: '100g' },
  'Chicken Breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
  'Fish Curry': { calories: 150, protein: 18, carbs: 5, fat: 6, unit: '100g' },
  'Mutton Curry': { calories: 250, protein: 15, carbs: 8, fat: 18, unit: '100g' },
  'Dal Tadka': { calories: 120, protein: 6, carbs: 18, fat: 3, unit: '100g' },
  'Bhindi Masala': { calories: 90, protein: 2, carbs: 10, fat: 5, unit: '100g' },
  'Mix Veg': { calories: 100, protein: 3, carbs: 15, fat: 4, unit: '100g' },
  'Aloo Matar': { calories: 110, protein: 3, carbs: 18, fat: 4, unit: '100g' },
  'Gajar Halwa': { calories: 180, protein: 3, carbs: 30, fat: 7, unit: '100g' },
  'Moong Dal Halwa': { calories: 220, protein: 5, carbs: 32, fat: 10, unit: '100g' },
  'Sheera': { calories: 210, protein: 3, carbs: 40, fat: 6, unit: '100g' },
  'Poha': { calories: 180, protein: 3, carbs: 35, fat: 4, unit: '1 plate' },
  'Sabudana Khichdi': { calories: 250, protein: 3, carbs: 50, fat: 6, unit: '1 plate' },
  'Dahi Vada': { calories: 120, protein: 4, carbs: 18, fat: 3, unit: '1 piece' },
  'Kachori': { calories: 200, protein: 4, carbs: 25, fat: 10, unit: '1 piece' },
  'Chana Masala': { calories: 140, protein: 7, carbs: 23, fat: 2, unit: '100g' },
  'Tandoori Chicken': { calories: 180, protein: 20, carbs: 2, fat: 9, unit: '100g' },
  'Paneer Tikka': { calories: 120, protein: 8.5, carbs: 2.3, fat: 8.7, unit: '100g' },
  'Egg Curry': { calories: 150, protein: 8, carbs: 6, fat: 10, unit: '100g' },
  'Bhatura': { calories: 200, protein: 5, carbs: 30, fat: 7, unit: '1 piece' },
  'Sooji Halwa': { calories: 250, protein: 4, carbs: 40, fat: 10, unit: '100g' },
  'Malpua': { calories: 200, protein: 3, carbs: 30, fat: 8, unit: '1 piece' },
  'Puran Poli': { calories: 200, protein: 5, carbs: 35, fat: 5, unit: '1 piece' },
  'Shrikhand': { calories: 200, protein: 6, carbs: 30, fat: 6, unit: '100g' },
  'Basundi': { calories: 180, protein: 5, carbs: 25, fat: 7, unit: '100g' },
  'Falooda': { calories: 300, protein: 4, carbs: 50, fat: 8, unit: '1 glass' },
  'Kulfi': { calories: 180, protein: 4, carbs: 20, fat: 8, unit: '1 piece' },
  'Rabri': { calories: 200, protein: 5, carbs: 25, fat: 10, unit: '100g' },
  'Motichoor Laddu': { calories: 150, protein: 2, carbs: 25, fat: 6, unit: '1 piece' },
  'Barfi': { calories: 120, protein: 2, carbs: 20, fat: 5, unit: '1 piece' },
  'Peda': { calories: 100, protein: 2, carbs: 18, fat: 3, unit: '1 piece' },
  'Rasgulla': { calories: 125, protein: 3, carbs: 24, fat: 3, unit: '1 piece' },
  'Sandesh': { calories: 120, protein: 4, carbs: 18, fat: 4, unit: '1 piece' },
  'Mishti Doi': { calories: 150, protein: 4, carbs: 25, fat: 4, unit: '100g' },
};

function Dashboard({ bmiData }) {
  const userId = 1;
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

  // Fetch meals from backend
  const fetchMeals = async (date) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/meals?userId=${userId}&date=${date}`);
      const data = await res.json();
      setMeals(data.meals || []);
      const totalCalories = (data.meals || []).reduce((sum, meal) => sum + Number(meal.calories), 0);
      setConsumedCalories(totalCalories);
    } catch {
      setMeals([]);
      setConsumedCalories(0);
    }
  };

  // Fetch badges from backend
  const fetchBadges = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/badges?userId=${userId}`);
      const data = await res.json();
      setBadges(data);
    } catch {
      setBadges({ calorieGoals: 0, mealLogging: 0, consistency: 0 });
    }
  };

  // Helper: Check if calorie goal badge already awarded for today
  const checkCalorieGoalAwarded = async (date) => {
    // Optionally, you could store a log of awarded dates in the backend for robustness
    // For now, we just check if the badge count matches the number of days achieved
    // This is a limitation, but works for single-user, single-device
    // You could also store the last awarded date in localStorage or backend
    return false; // Always allow for demo; for production, implement a log
  };

  // Helper: Check if previous day had a meal
  const checkPreviousDayMeal = async (date) => {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = prevDate.toISOString().slice(0, 10);
    try {
      const res = await fetch(`/api/meals?userId=${userId}&date=${prevDateStr}`);
      const data = await res.json();
      return (data.meals && data.meals.length > 0);
    } catch {
      return false;
    }
  };

  // Update badges in backend and then fetch latest
  const updateBadges = async (newBadges) => {
    if (!userId) return;
    await fetch('/api/badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...newBadges }),
    });
    fetchBadges();
  };

  // On mount and when date changes, fetch meals and badges
  useEffect(() => {
    fetchMeals(mealData.date);
    fetchBadges();
    // eslint-disable-next-line
  }, [mealData.date, userId]);

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
    const newDate = e.target.value;
    setMealData(prev => ({ ...prev, date: newDate }));
    fetchMeals(newDate);
  };

  const handleMealLog = async (e) => {
    e.preventDefault();
    if (!mealData.food || !mealData.quantity || !mealData.calories) {
      alert('Please fill in all fields');
      return;
    }
    const newMeal = {
      ...mealData,
      userId,
      id: Date.now(),
      timestamp: new Date(mealData.date + 'T' + new Date().toTimeString().slice(0,8)),
      nutritionalInfo: selectedFood
    };
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeal),
      });
      const data = await res.json();
      if (res.ok) {
        setLastAddedMealId(data.mealId);
        await fetchMeals(mealData.date);
        // Fetch latest meals and badges
        let latestBadges = badges;
        try {
          const badgeRes = await fetch(`/api/badges?userId=${userId}`);
          latestBadges = await badgeRes.json();
        } catch {}
        let updatedBadges = { ...latestBadges };
        // 1. Meals Logged: always increment
        updatedBadges.mealLogging = (updatedBadges.mealLogging || 0) + 1;
        // 2. Calorie Goals: only increment ONCE per day if total calories for the day is in range
        let totalCalories = 0;
        try {
          const mealRes = await fetch(`/api/meals?userId=${userId}&date=${mealData.date}`);
          const mealDataRes = await mealRes.json();
          totalCalories = (mealDataRes.meals || []).reduce((sum, meal) => sum + Number(meal.calories), 0);
        } catch {}
        const alreadyAwarded = false; // For demo, always allow; for production, check log
        if (
          totalCalories >= dailyTarget * 0.9 &&
          totalCalories <= dailyTarget * 1.1 &&
          !alreadyAwarded
        ) {
          updatedBadges.calorieGoals = (updatedBadges.calorieGoals || 0) + 1;
        }
        // 3. Daily Streak: increment if previous day had a meal, else reset to 1
        const prevDayHadMeal = await checkPreviousDayMeal(mealData.date);
        if (prevDayHadMeal) {
          updatedBadges.consistency = (updatedBadges.consistency || 0) + 1;
        } else {
          updatedBadges.consistency = 1;
        }
        await updateBadges(updatedBadges);
        setMealData({
          food: '',
          quantity: '',
          unit: 'g',
          calories: '',
          mealType: 'Breakfast',
          date: new Date().toISOString().slice(0, 10)
        });
        setSelectedFood(null);
      } else {
        alert(data.error || 'Failed to log meal');
      }
    } catch {
      alert('Network error');
    }
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
    if (!bmiData || !userId) {
      navigate('/onboarding');
    }
  }, [bmiData, userId, navigate]);

  if (!bmiData || !userId) return null; // Prevents destructuring or rendering until redirect

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
        </div>
      </div>
      <div className="max-w-6xl flex gap-8 pl-8 animate-fadeinup">
        {/* Left Side - Recent Meals */}
        <div className="w-[260px] flex-shrink-0 animate-fadeinup">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-['Instrument_Serif']">Meals</h2>
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
            {meals
              .filter(meal => new Date(meal.timestamp).toDateString() === new Date(mealData.date).toDateString())
              .map(meal => (
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

      <style>{`
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