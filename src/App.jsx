import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './components/PrivateRoutes';
import { AuthProvider } from './utils/AuthContext';
import Login from './pages/Login';
import Room from './pages/Room';
import Register from './pages/Register';

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected pages */}
          <Route element={<PrivateRoutes />} >
            <Route path="/" element={<Room />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
