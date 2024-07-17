// src/components/SignUp.js
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Modal } from 'react-bootstrap';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import { sejong_authenticate } from '../sejong_auth';


const SignUp = () => {
  const [sejongId, setSejongId] = useState('');
  const [sejongPassword, setSejongPassword] = useState('');
  const [webId, setWebId] = useState('');
  const [webPassword, setWebPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      setError('Sejong authentication failed. Please try again.');
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
      const hashedPassword = await bcrypt.hash(webPassword, 10);
      const userRef = ref(db, 'users/' + webId);
      await set(userRef, {
        id: webId,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      });

      setSuccess('User created successfully!');
      setError(null);
      setShowModal(true);
      console.log('User created and saved to Realtime Database:', webId);
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
          <Modal.Title>{success ? 'Success' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{success || error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SignUp;
