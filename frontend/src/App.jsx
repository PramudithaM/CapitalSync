import React from 'react'
import { Routes, Route } from "react-router-dom";
import Starting from './pages/Starting';
import Loginpage from './pages/Loginpage';
import Home from './pages/Home';
import IncomePage from './pages/IncomePage';
import SignUp from './pages/SignUp';
import Aboutus from './pages/Aboutus';
import Analytics from './pages/Analytics';
import ExpensesPage from './pages/ExpensesPage';
import TransactionPage from './pages/TransactionPage';
import { useEffect, useState } from 'react';
import { auth, logout } from './firebase';
import { useNavigate, useLocation } from 'react-router-dom';


const App = () => {

  const [data, setData] = useState(null);
  const API = import.meta.env.VITE_API_URL || '';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    const checkSession = (user) => {
      if (user) {
        const sessionStartTime = localStorage.getItem('sessionStartTime');
        let isValid = true;
        if (!sessionStartTime) {
          localStorage.setItem('sessionStartTime', Date.now().toString());
        } else if (Date.now() - parseInt(sessionStartTime, 10) > TWENTY_FOUR_HOURS) {
          isValid = false;
          localStorage.removeItem('sessionStartTime');
          logout().then(() => {
            navigate('/login');
          });
        }

        if (isValid) {
          const path = window.location.pathname;
          if (path === '/' || path === '/login') {
            navigate('/home-page');
          }
        }
      } else {
        localStorage.removeItem('sessionStartTime');
        const path = window.location.pathname;
        if (path !== '/' && path !== '/login' && path !== '/sign-up' && path !== '/about-us') {
          navigate('/login');
        }
      }
    };

    const unsub = auth.onAuthStateChanged((user) => {
      checkSession(user);
    });

    const intervalId = setInterval(() => {
      checkSession(auth.currentUser);
    }, 60 * 1000); // Check every minute

    return () => {
      unsub();
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const url = API ? `${API}/` : '/api/';
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((result) => setData(result))
      .catch((err) => console.error('Failed to load root:', err));
  }, [API]);

  return (
    <Routes>
      <Route path="/" element={<Starting />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/home-page" element={<Home />} />
      <Route path="/income-page" element={<IncomePage />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/about-us" element={<Aboutus />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/expenses-page" element={<ExpensesPage />} />
      <Route path="/transaction-page" element={<TransactionPage />} />

    </Routes>
  );
}

export default App