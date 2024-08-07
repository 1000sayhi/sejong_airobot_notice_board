import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Modal } from 'react-bootstrap';
import { db } from '../firebase';
import { child, get, ref, set } from 'firebase/database';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import { sejong_authenticate } from '../sejong_auth';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [sejongId, setSejongId] = useState('');
  const [sejongPassword, setSejongPassword] = useState('');
  const [webId, setWebId] = useState('');
  const [webPassword, setWebPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleClose = () => {
    setShowModal(false);
    if (success) {
      navigate(-1);
    }
  };

  const handleSejongAuth = async (event) => {
    event.preventDefault();
    try {
      const authResult = await sejong_authenticate(sejongId, sejongPassword);
      console.log(authResult)
      if (authResult.is_auth) {
        setIsAuthenticated(true);
        setError(null);
        setWebId(sejongId)
      }
    } catch (error) {
      console.error('Error authenticating:', error);
      setError('세종 인증에 실패하였습니다.');
      setSuccess(null);
      setShowModal(true);
    }
  };

  const onSignUp = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setError('Please authenticate with Sejong first.');
      setSuccess(null);
      setShowModal(true);
      return;
    }

    try {
      const userRef = ref(db, 'users/' + webId);
      const snapshot = await get(child(ref(db), `users/${webId}`));

      if (snapshot.exists()) {
        setError('이미 가입된 계정입니다.');
        setSuccess(null);
        setShowModal(true);
        return;
      }


      const hashedPassword = await bcrypt.hash(webPassword, 10);
      await set(userRef, {
        id: webId,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      });

      setSuccess('회원가입 되었습니다.');
      setError(null);
      setShowModal(true);
      console.log('User created and saved to Realtime Database:', webId);
      await login(webId, webPassword);
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.');
      setSuccess(null);
      setShowModal(true);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="justify-content-md-center w-100">
        <Col md={4}>
          <h2>회원가입</h2>          
            <Form onSubmit={handleSejongAuth}>
              <Form.Group controlId="formSejongId">
                <Form.Label>세종 아이디</Form.Label>
                <Form.Control
                  type="text"
                  value={sejongId}
                  onChange={(e) => setSejongId(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formSejongPassword">
                <Form.Label>세종 비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  value={sejongPassword}
                  onChange={(e) => setSejongPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                세종 인증
              </Button>
            </Form>
            {isAuthenticated?<div>인증되었습니다</div>:<div>인증되지 않았습니다.</div>}
            <Form onSubmit={onSignUp}>
              <Form.Group controlId="formWebId">
                <Form.Label>웹 아이디</Form.Label>
                <Form.Control
                  type="text"
                  value={webId}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formWebPassword">
                <Form.Label>새 비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  value={webPassword}
                  onChange={(e) => setWebPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                회원가입
              </Button>
            </Form>
          
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{success ? '회원가입 되었습니다.' : '오류 발생.'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{success || error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SignUp;
