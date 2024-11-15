import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Home } from './pages/Home';
import { Blackjack } from './pages/Blackjack';
import { Roulette } from './pages/Roulette';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blackjack" element={<Blackjack />} />
          <Route path="/roulette" element={<Roulette />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;