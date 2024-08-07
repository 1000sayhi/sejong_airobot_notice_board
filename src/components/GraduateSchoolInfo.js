import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { fetchLabInfo } from '../fetching';
import styles from './GraduateSchoolInfo.module.css'

const GraduateSchoolInfo = () => {
  const [labInfoData, setLabInfoData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const labInfoData = await fetchLabInfo();
      console.log(labInfoData)
      setLabInfoData(labInfoData.slice(0,30));
    };
    fetchData();
  }, []);

  return (
    <Card style={{ width: '100%', height:'280vh' }}>
      <Card.Body>
    <Card.Title style={{ fontSize:"28px", marginBottom:"2rem" }}>
      대학원 소개
    </Card.Title>
    <Card.Text className={styles.gridContainer}>
      {labInfoData.length > 0 ? (
        labInfoData.map((notice, index) => (
          <div key={index} style={{ border: "1px solid #ddd", padding: "10px" }}>
            <div className={styles.profName}>{notice.profName}</div>
            {notice.labURL ? (
              <a className={`link-secondary ${styles.linkCustom}`} href={notice.labURL}>{notice.labName}</a>
            ) : (
              <span className='link-secondary'>{notice.labName}</span>
            )}
          </div>
        ))
      ) : (
        'Loading...'
      )}
      </Card.Text>
    </Card.Body>

    </Card>
  )
}

export default GraduateSchoolInfo
