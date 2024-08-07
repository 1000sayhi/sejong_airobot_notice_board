import React from 'react'
import { Stack } from 'react-bootstrap'
import styles from './Header.module.css'
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ goLogin, handleLogout }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const goProfile = () => {
    navigate('/profile');
  };
  
  return (
    <Stack direction="horizontal" gap={3}>
      <div className={`${styles.menuBar} p-2`}>
        <div className={styles.menuItem}><a href='https://open.kakao.com/o/g7BgYDsc'>소융대 졸업생</a></div>
        <div className={styles.menuItem}><a href='https://open.kakao.com/o/gGgbhAGg'>대학원 정보</a></div>
        <div className={styles.menuItem}><a href='https://open.kakao.com/o/svSJdAGg'>대외활동 팀빌딩</a></div>
      </div>
      {currentUser ? (
        <div className={`p-2 ms-auto ${styles.logout}`} onClick={handleLogout}><p>로그아웃</p></div>
      ) : (
        <div className={`p-2 ms-auto ${styles.login}`} onClick={goLogin}><p>로그인</p></div>
      )}
      <div onClick={currentUser ? goProfile : goLogin} className={`p-2 ${styles['user-icon-container']}`}><FontAwesomeIcon icon={faUser} /></div>
    </Stack>
  )
}

export default Header
