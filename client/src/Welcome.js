import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (name.trim()) {
      localStorage.setItem('calpalUserName', name.trim());
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#212E28] to-[#020202] text-white p-4 pt-12 animate-pagefadein">
      <div className="max-w-md w-full text-center animate-fadeinup">
        <h1 className="text-6xl font-['Instrument_Serif'] mb-2 drop-shadow-lg">Welcome to CalPal</h1>
        <p className="text-lg mb-10 text-gray-200 font-['Instrument_Serif']">Personalized nutrition, made simple.</p>
        <label className="block text-lg mb-2 font-['Instrument_Serif']">What should we call you?</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-3 rounded-md bg-white/10 border border-gray-600 text-white text-lg mb-8 focus:outline-none focus:border-white font-['Instrument_Serif']"
        />
        <button
          onClick={handleNext}
          disabled={!name.trim()}
          className="mx-auto block mt-4 disabled:opacity-50 group"
          aria-label="Next"
        >
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]">
            <path d="M49.9999 66.6666L66.6666 49.9999M66.6666 49.9999L49.9999 33.3333M66.6666 49.9999H33.3333M91.6666 49.9999C91.6666 73.0118 73.0118 91.6666 49.9999 91.6666C26.9881 91.6666 8.33325 73.0118 8.33325 49.9999C8.33325 26.9881 26.9881 8.33325 49.9999 8.33325C73.0118 8.33325 91.6666 26.9881 91.6666 49.9999Z" stroke="white" strokeOpacity="0.88" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="transition-colors group-hover:stroke-[#7fffd4]"/>
          </svg>
        </button>
      </div>
      <style jsx global>{`
        @keyframes fadeinup {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeinup {
          animation: fadeinup 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes pagefadein {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-pagefadein {
          animation: pagefadein 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  );
} 