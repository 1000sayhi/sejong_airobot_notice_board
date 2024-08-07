import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database'; 
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import styles from './GradeRegister.module.css'

const ShowYouCanGraduate = ({refresh}) => {
    const { currentUser } = useAuth();
    const studentId = currentUser.id;
    const [results, setResults] = useState([]);
    const [certificationResults, setCertificationResults] = useState([]);
    const [isGraduated, setIsGraduated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRef = ref(db, `users/${studentId}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setResults(data.results || []);
                    setCertificationResults(data.certifications || []);
                    setIsGraduated(data.isGraduated || false);
                } else {
                    setError('No data found');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId,refresh]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1>졸업 요건 검사 결과</h1>
            <div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>요건</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>{result[0]}</td>
                                <td>{result[1]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2>고전 독서 인증</h2>
                <span className={certificationResults[0]?.[1] === 'P' ? styles.pass : styles.fail}>
                    {certificationResults[0]?.[1] === 'P' ? '패스' : '논패스'}
                </span>
            </div>
            <div>
                <h2>어학 인증</h2>
                <span className={certificationResults[1]?.[1] === 'P' ? styles.pass : styles.fail}>
                    {certificationResults[1]?.[1] === 'P' ? '패스' : '논패스'}
                </span>
            </div>
            {certificationResults.length > 2 && (
                <div>
                    <h2>소프트웨어 코딩 인증</h2>
                    <span className={certificationResults[2]?.[1] === 'P' ? styles.pass : styles.fail}>
                        {certificationResults[2]?.[1] === 'P' ? '패스' : '논패스'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ShowYouCanGraduate;
