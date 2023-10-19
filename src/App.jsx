import React from 'react';
import {BrowserRouter,HashRouter , Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AddGymBoy from './pages/AddGymBoy';
import ViewGymBoys from './pages/ViewGymBoys';
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Homepage';

function App() {
  return (
    <HashRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} /> 
        <Route path="Homepage/*" element={<Homepage />} />
        <Route path="AddGymBoy/*" element={<AddGymBoy />} />
        <Route path="ViewGymBoys/*" element={<ViewGymBoys />} />
        
      </Routes>
    </HashRouter>
  );
}

export default App;
