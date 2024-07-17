import React from 'react';
import PleaseGraduate from '../components/PleaseGraduate';
import NoticeBoard from '../components/NoticeBoard';
import GraduateSchoolInfo from '../components/GraduateSchoolInfo';
import Header from '../Layout/Header';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  const goLogin = () => {
    navigate('/login');
  };
  
  const goGradeRegister = () => {
    navigate('/gradeRegister');
  };
  
  return (
    <>
      <Header goLogin={goLogin} />
      <div className="main-container">
        <div className="content">
          <div className="top-section">
            <PleaseGraduate goGradeRegister={goGradeRegister} />
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
