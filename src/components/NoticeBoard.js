import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { fetchNoticeData, fetchSchoolNoticeData } from '../fetching';  // Default import
import styles from './NoticeBoard.module.css';

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
    <Card style={{ width: '100%', paddingBottom: '20px' }}>
      <Card.Title style={{ padding: '0.7rem', fontSize: '28px', marginBottom: '2rem' }}>
        공지사항
      </Card.Title>
      <Card.Body className={styles.noticeContainer}>
        <div className={styles.noticeSectionContainer}>
          <Card.Text className={styles.noticeSection}>
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
          <Card.Text className={styles.noticeSection}>
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
        </div>
      </Card.Body>
      <div className={styles.linkSection}>
          <a className={`link-secondary ${styles.linkCustom}`} href="https://do.sejong.ac.kr">두드림 홈페이지 바로가기</a>
          <hr />
          <a className={`link-secondary ${styles.linkCustom}`} href="http://classic.sejong.ac.kr/">대양 휴머니티 칼리지 홈페이지 바로가기</a>
      </div>
    </Card>
  );
}

export default NoticeBoard;