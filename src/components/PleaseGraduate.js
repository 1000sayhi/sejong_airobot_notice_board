import React from 'react'
import { Button, Card, Stack } from 'react-bootstrap'

const PleaseGraduate = ({goGradeRegister}) => {
  return (
    <Card style={{ width: '40rem', height:'18rem', marginBottom:'2rem' }}>
      <Card.Body>
        <Card.Title>
            <Stack direction="horizontal" gap={3}>
                <div className="p-2">PleaseGraduate</div>
                <div className="p-2 ms-auto"><Button variant="primary" onClick={goGradeRegister}>성적 등록하기</Button></div>
            </Stack>
        </Card.Title>
        <Card.Text style={{textAlign:"center"}}>
          성적을 등록해주세요.
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default PleaseGraduate
