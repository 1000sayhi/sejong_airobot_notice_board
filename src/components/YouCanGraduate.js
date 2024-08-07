import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { Button, Card, Stack } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import './YouCanGraduate.css';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const YouCanGraduate = ({ goGradeRegister }) => {
  const [results, setResults] = useState(null);
  const { currentUser } = useAuth();
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          const studentRef = ref(db, `users/${currentUser.id}`);
          const studentSnapshot = await get(studentRef);
          const studentData = studentSnapshot.val();

          if (studentData && studentData.results) {
            const results = studentData.results.slice(2); // 첫 두 항목 무시
            let categories = results.map(result => result[0]);
            let completedCategoryCredits = results.map(result => parseInt(result[1].split('/')[0]));
            let categoryRequirements = results.map(result => parseInt(result[1].split('/')[1]));

            // '교선1'과 '교선2'를 '교선'으로 통합
            const finalCategories = [];
            const finalCompletedCategoryCredits = [];
            const finalCategoryRequirements = [];

            categories.forEach((cat, index) => {
              if (cat === '교선1' || cat === '교선2') {
                const combinedIndex = finalCategories.indexOf('교선');
                if (combinedIndex === -1) {
                  return;
                } else {
                  finalCompletedCategoryCredits[combinedIndex] += completedCategoryCredits[index];
                  finalCategoryRequirements[combinedIndex] += categoryRequirements[index];
                }
              } else {
                finalCategories.push(cat);
                finalCompletedCategoryCredits.push(completedCategoryCredits[index]);
                finalCategoryRequirements.push(categoryRequirements[index]);
              }
            });

            setResults({
              categories: finalCategories,
              completed: finalCompletedCategoryCredits,
              required: finalCategoryRequirements,
            });
          }
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

      fetchData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (results) {
      if (chartInstance) {
        chartInstance.destroy(); // 이전 차트 인스턴스를 파괴
      }

      const ctx = document.getElementById('creditsChart').getContext('2d');
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: results.categories,
          datasets: [
            {
              label: '이수 학점',
              data: results.completed,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              datalabels: {
                align: 'start',
                anchor: 'end',
                color: 'rgba(75, 192, 192, 1)',
                formatter: (value) => value,
              },
            },
            {
              label: '필요 학점',
              data: results.required,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              datalabels: {
                align: 'end',
                anchor: 'end',
                color: 'rgba(255, 99, 132, 1)',
                formatter: (value) => value,
              },
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              display: true,
            },
          },
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
              stacked: true,
              display: false,
            },
            y: {
              stacked: true,
              display: true,
              title: {
                display: true,
                text: '이수 구분',
              },
            },
          },
        },
        plugins: [ChartDataLabels],
      });

      setChartInstance(newChartInstance); // 새로운 차트 인스턴스를 상태에 저장
    }
  }, [results]);
  

  if (results) {
    return (
      <Card style={{ width: '100%', height: 'auto', marginBottom: '2rem' }}>
        <Card.Body>
          <Card.Text style={{ textAlign: 'center' }}>
          <div className="canvasContainer">
            <div>
              <h3>이수 학점</h3>
              <Button variant="secondary" onClick={goGradeRegister}>성적 자세히 보기</Button>
            </div>
            <canvas id="creditsChart"></canvas>
          </div>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card style={{ width: '100%', height: '18rem', marginBottom: '2rem' }}>
      <Card.Body>
        <Card.Title>
          <Stack direction="horizontal" gap={3}>
            <div className="p-2">YouCanGraduate</div>
            <div className="p-2 ms-auto">
              <Button variant="secondary" onClick={goGradeRegister}>성적 등록하기</Button>
            </div>
          </Stack>
        </Card.Title>
        <Card.Text style={{ textAlign: "center" }}>
          현재 등록된 성적이 없습니다. 성적을 등록해주세요.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default YouCanGraduate;
