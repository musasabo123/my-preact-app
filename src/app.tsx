import { Router } from 'preact-router';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/Admindashboard';
import GpaCalculate from "./pages/Gpacalculate";
import Dashboard from "./pages/dashboard";
export function App() {
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      
      <div className="flex-1 flex flex-col">
        <Router>
          <Home default />
          <Signup path="/signup" />
          <Login path="/login" />
          <Admin path="/admin" />
         <AdminDashboard path="/admin-dashboard" />
          <GpaCalculate path="/gpa-calculate"/>
          <Dashboard path="/dashboard" />

        </Router>
      </div>
    </div>
  )
}
