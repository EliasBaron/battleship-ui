import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Game from './components/Game.jsx';
import Home from './components/Home.jsx';
import Rules from './components/Rules.jsx';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/game" element={<Game />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}