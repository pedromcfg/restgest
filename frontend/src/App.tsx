import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navbar';
import Login from './components/Login';
import Inventory from './components/Inventory';
import Students from './components/Students';
import Services from './components/Services';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Navigate to="/inventory" replace />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/services" element={<Services />} />
                  </Routes>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
