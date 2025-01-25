import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import HospitalDashboard from './components/HospitalDashboard';
import Register from './components/RegistrationPage';
import BloodBankDashboard from './components/BloodBankDashboard';
import LandingPage from './components/LandingPage';
import DonationCampDashboard from './components/DonationCampDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        <Route path="/blood-bank-dashboard" element={<BloodBankDashboard />} />
        <Route path="/donation-camp-dashboard" element={<DonationCampDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
