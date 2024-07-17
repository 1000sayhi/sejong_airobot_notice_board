import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const [id, setId]= useState('')
  const [password, setPassword]= useState('')
  const onLogin = (event) => {
    event.preventDefault(); 
    console.log(id)
  }
  const goSignUp = () => {
    navigate('/signup')
  }
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="justify-content-md-center w-100">
        <Col md={4}>
          <h2>로그인</h2>
          <Form>
            <Form.Group controlId="formBasicId">
              <Form.Label>아이디</Form.Label>
              <Form.Control 
                type="Id"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={onLogin}>
              로그인
            </Button>
            <div>계정이 없으신가요?<p onClick={goSignUp}>회원가입</p></div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
