import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onLogin = async (event) => {
    event.preventDefault();
    const isLoggedIn = await login(id, password);
    if (isLoggedIn) {
      navigate('/'); 
    } else {
      setError('로그인에 실패하였습니다. 아이디와 비밀번호를 다시 확인해주세요.');
    }
  };

  const goSignUp = () => {
    navigate('/signup');
  };

  return (
    <Container className={`${styles.container} d-flex align-items-center justify-content-center`}>
      <Row className="justify-content-md-center w-100">
        <Col md={4} className={styles.loginBox}>
          <h2 className={styles.title}>로그인</h2>
          <Form onSubmit={onLogin}>
            <Form.Group controlId="formBasicId" className={styles.formGroup}>
              <Form.Label>아이디</Form.Label>
              <Form.Control
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className={styles.formGroup}>
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="secondary" type="submit" className={styles.button}>
              로그인
            </Button>
            {error && <div className="text-danger mt-2">{error}</div>}
            <div className={styles.signupLink}>
              계정이 없으신가요? <p onClick={goSignUp}>회원가입</p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
