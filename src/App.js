import './App.css';
import { Route,Routes } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import GradeRegister from './routes/GradeRegister';
import { AuthProvider } from './context/AuthContext';
import Profile from './routes/Profile';
import ShowYouCanGraduate from './routes/ShowYouCanGraduate';



function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/gradeRegister' element={<GradeRegister />} />
          <Route path='/showyoucangraduate' element={<ShowYouCanGraduate />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
