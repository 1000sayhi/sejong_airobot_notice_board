import './App.css';
import { Route,Routes } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import GradeRegister from './routes/GradeRegister';
import { AuthProvider } from './context/AuthContext';



function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/gradeRegister' element={<GradeRegister />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
