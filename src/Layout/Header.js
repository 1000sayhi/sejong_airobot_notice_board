import React from 'react'
import { Stack } from 'react-bootstrap'
import './Header.css'
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({goLogin}) => {
  return (
    <Stack direction="horizontal" gap={3}>
      <div className="menu-bar p-2">
          <div className="menu-item">소융대 졸업생</div>
          <div className="menu-item">대학원 정보</div>
          <div className="menu-item">대외활동 팀빌딩</div>
      </div>
      <div className="p-2 ms-auto login" onClick={goLogin}><p>로그인</p></div>
      <div className="p-2 user-icon-container"><FontAwesomeIcon icon={faUser} /></div>
    </Stack>
    
  )
}

export default Header
