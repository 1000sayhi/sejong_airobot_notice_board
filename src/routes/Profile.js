import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import { ref, set } from 'firebase/database'; 
import { db } from '../firebase'; 
import bcrypt from 'bcryptjs';
import styles from './Profile.module.css'; 

const Profile = () => {
  const { currentUser } = useAuth(); 
  const navigate = useNavigate(); 
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    try {
      if (!newPassword) {
        setError('새 비밀번호를 입력해주세요.');
        return;
      }

      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const userRef = ref(db, 'users/' + currentUser.id);
      await set(userRef, {
        ...currentUser,
        password: hashedPassword,
      });

      setSuccess('비밀번호가 성공적으로 변경되었습니다.');
      setError('');
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      setSuccess('');
    }
  };

  if (!currentUser) {
    return <div>로그인 상태가 아닙니다.</div>;
  }

  return (
    <Container className={styles.container}>
      <h2>프로필 페이지</h2>
      <div>
        <p><strong>아이디</strong> {currentUser.id}</p>
      </div>
      <Form onSubmit={handlePasswordChange}>
        <Form.Group controlId="formNewPassword" className={styles.formGroup}>
          <Form.Label>새 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="secondary" type="submit" className={styles.buttonPrimary}>
          비밀번호 변경
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      {success && <Alert variant="success" className="mt-2">{success}</Alert>}
      <Button 
        variant="secondary" 
        onClick={() => navigate('/')} 
        className={styles.buttonSecondary}
      >
        홈으로 돌아가기
      </Button>
    </Container>
  );
};

export default Profile;
