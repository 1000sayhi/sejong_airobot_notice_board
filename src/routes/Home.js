import React from 'react';
import YouCanGraduate from '../components/YouCanGraduate';
import NoticeBoard from '../components/NoticeBoard';
import GraduateSchoolInfo from '../components/GraduateSchoolInfo';
import Header from '../Layout/Header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); 

  const goLogin = () => {
    navigate('/login');
  };

  const goGradeRegister = () => {
    navigate('/gradeRegister');
  };

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <>
      <Header goLogin={goLogin} handleLogout={handleLogout} />
      <div className="main-container">
        <div className="content">
          <div className="top-section">
            {currentUser ? <YouCanGraduate goGradeRegister={goGradeRegister} />:<p style={{fontSize:"28px"}}>성적을 입력하려면 로그인을 해주세요.</p>}
          </div>
          <div className="middle-section">
            <NoticeBoard />
          </div>
          <div className="bottom-section">
            <GraduateSchoolInfo />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
