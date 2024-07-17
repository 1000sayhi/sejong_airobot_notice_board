import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { fetchNoticeData, fetchSchoolNoticeData } from '../fetching';  // Default import
const NoticeBoard = () => {
  const [noticeData, setNoticeData] = useState([]);
  const [schoolNoticeData, setSchoolNoticeData] = useState([]);
  // const [doDreamNoticeData, setDoDreamNoticeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const schoolNoticeData = await fetchSchoolNoticeData();
      const noitceData = await fetchNoticeData();
      // const doDreamNoticeData = await fetchDoDreamNoticeData();
      console.log(schoolNoticeData)
      console.log(noitceData)
      // console.log(doDreamNoticeData)
      setSchoolNoticeData(schoolNoticeData.slice(0,5));
      setNoticeData(noitceData.slice(0,5));
      // setDoDreamNoticeData(doDreamNoticeData.slice(0,5));
    };
    fetchData();
  }, []);

  return (
    <Card style={{ width: '40rem', height: '20rem', marginBottom: '2rem' }}>
      <Card.Title style={{padding:"0.7rem"}}>
          공지사항
      </Card.Title>
      <Card.Body style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "10px" }}>
        <Card.Text style={{ textAlign: "center" }}>
          <Card.Title>
            학교 공지사항
          </Card.Title>
          {schoolNoticeData.length > 0 ? (
            schoolNoticeData.map((notice, index) => (
              <div key={index}>{notice.title}</div>
            ))
          ) : (
            'Loading...'
          )}
        </Card.Text>
        <Card.Text style={{ textAlign: "center", }}>
          <Card.Title>
            학부 공지사항
          </Card.Title>
          {noticeData.length > 0 ? (
            noticeData.map((notice, index) => (
              <div key={index}>{notice.title}</div>
            ))
          ) : (
            'Loading...'
          )}
        </Card.Text>
        <Card.Text style={{ textAlign: "center", }}>
          <a href="https://do.sejong.ac.kr">두드림 홈페이지 바로가기</a>
        </Card.Text>
        <Card.Text style={{ textAlign: "center", }}>
        <a href="http://classic.sejong.ac.kr/">대양 휴머니티 칼리지 홈페이지 바로가기</a>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default NoticeBoard;
