// Test: trivial change to check git tracking
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function groupMealsByDate(meals) {
  return meals.reduce((acc, meal) => {
    const date = new Date(meal.timestamp).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {});
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

function getMonthMatrix(year, month) {
  const days = getMonthDays(year, month);
  const matrix = [];
  let week = [];
  const firstDayOfWeek = days[0].getDay();
  for (let i = 0; i < firstDayOfWeek; i++) week.push(null);
  days.forEach(day => {
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
    week.push(day);
  });
  while (week.length < 7) week.push(null);
  matrix.push(week);
  return matrix;
}

export default function MealHistory() {
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) setMeals(JSON.parse(savedMeals));
  }, []);

  const grouped = groupMealsByDate(meals);
  const mealDates = Object.keys(grouped).map(d => new Date(d).toDateString());

  const { year, month } = calendarMonth;
  const monthMatrix = getMonthMatrix(year, month);
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCalendarMonth(prev => {
      const m = prev.month - 1;
      if (m < 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: m };
    });
    setSelectedDate(null);
  };
  const handleNextMonth = () => {
    setCalendarMonth(prev => {
      const m = prev.month + 1;
      if (m > 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: m };
    });
    setSelectedDate(null);
  };

  const selectedDateStr = selectedDate ? selectedDate.toDateString() : null;
  const mealsForSelected = selectedDateStr ? grouped[selectedDateStr] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#212E28] to-[#020202] text-white p-8 animate-fadeinup">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-['Instrument_Serif']">Meal History</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-[#212E28] py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors font-['Instrument_Serif']"
          >
            Back to Dashboard
          </button>
        </div>
        {/* Calendar */}
        <div className="bg-white bg-opacity-5 rounded-lg p-6 mb-8 shadow animate-fadeinup">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="text-xl px-2 py-1 rounded hover:bg-white/10">&#8592;</button>
            <span className="text-lg font-['Instrument_Serif']">{monthName}</span>
            <button onClick={handleNextMonth} className="text-xl px-2 py-1 rounded hover:bg-white/10">&#8594;</button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="font-semibold text-gray-300">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {monthMatrix.flat().map((day, idx) => {
              if (!day) return <div key={idx} />;
              const dayStr = day.toDateString();
              const hasMeals = mealDates.includes(dayStr);
              const isSelected = selectedDateStr === dayStr;
              return (
                <button
                  key={dayStr}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square w-10 rounded-lg flex flex-col items-center justify-center transition-all duration-200
                    ${hasMeals ? 'bg-green-700/80 text-white font-bold' : 'bg-white/10 text-gray-300'}
                    ${isSelected ? 'ring-2 ring-white scale-110 z-10' : ''}
                    hover:bg-green-800/90`}
                >
                  {day.getDate()}
                  {hasMeals && <span className="w-1.5 h-1.5 mt-1 rounded-full bg-white inline-block" />}
                </button>
              );
            })}
          </div>
        </div>
        {/* Meals for selected day */}
        {selectedDateStr && (
          <div className="animate-fadeinup">
            <h2 className="text-xl mb-4 font-['Instrument_Serif']">{selectedDateStr}</h2>
            {mealsForSelected ? (
              <div className="space-y-4">
                {mealsForSelected.map(meal => (
                  <div key={meal.id} className="bg-white bg-opacity-10 p-4 rounded-lg border border-gray-700 animate-fadeinup">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium font-['Instrument_Serif'] text-lg">{meal.food}</span>
                        <span className="text-sm text-gray-300 ml-2">({meal.mealType})</span>
                      </div>
                      <span className="text-lg font-['Instrument_Serif']">{meal.calories} kcal</span>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-200 mb-1">
                      <span>Quantity: {meal.quantity} {meal.unit}</span>
                      <span>Time: {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {meal.nutritionalInfo && (
                      <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                        <span>Protein: {meal.nutritionalInfo.protein}g</span>
                        <span>Carbs: {meal.nutritionalInfo.carbs}g</span>
                        <span>Fat: {meal.nutritionalInfo.fat}g</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center">No meals logged for this day.</div>
            )}
          </div>
        )}
      </div>
      <style jsx global>{`
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