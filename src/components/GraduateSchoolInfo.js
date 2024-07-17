import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { fetchLabInfo } from '../fetching';

const GraduateSchoolInfo = () => {
  const [labInfoData, setLabInfoData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const labInfoData = await fetchLabInfo();
      console.log(labInfoData)
      setLabInfoData(labInfoData.slice(0,21));
    };
    fetchData();
  }, []);

  return (
    <Card style={{ width: '40rem', height:'72rem' }}>
      <Card.Body>
    <Card.Title>
      대학원 소개
    </Card.Title>
    <Card.Text style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(5, auto)", gap: "10px", textAlign: "center" }}>
      {labInfoData.length > 0 ? (
        labInfoData.map((notice, index) => (
          <div key={index} style={{ border: "1px solid #ddd", padding: "10px" }}>
            <div>{notice.profName}</div>
            {notice.labURL ? (
              <a href={notice.labURL}>{notice.labName}</a>
            ) : (
              <span>{notice.labName}</span>
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
