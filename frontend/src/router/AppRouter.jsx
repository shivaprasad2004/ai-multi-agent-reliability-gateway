import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Requests from '../pages/Requests';
import Providers from '../pages/Providers';
import Models from '../pages/Models';
import Agents from '../pages/Agents';
import Guardrails from '../pages/Guardrails';
import Playground from '../pages/Playground';
import Navbar from '../components/Navbar';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navbar />
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <Navbar />
              <Requests />
            </PrivateRoute>
          }
        />
        <Route
          path="/providers"
          element={
            <PrivateRoute>
              <Navbar />
              <Providers />
            </PrivateRoute>
          }
        />
        <Route
          path="/models"
          element={
            <PrivateRoute>
              <Navbar />
              <Models />
            </PrivateRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <PrivateRoute>
              <Navbar />
              <Agents />
            </PrivateRoute>
          }
        />
        <Route
          path="/guardrails"
          element={
            <PrivateRoute>
              <Navbar />
              <Guardrails />
            </PrivateRoute>
          }
        />
        <Route
          path="/playground"
          element={
            <PrivateRoute>
              <Navbar />
              <Playground />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

