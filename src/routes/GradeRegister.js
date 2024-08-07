import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ref, get } from 'firebase/database'; 
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import ShowYouCanGraduate from './ShowYouCanGraduate';
import { sejong_authenticate } from '../sejong_auth';
import styles from './GradeRegister.module.css'

const GradeRegister = () => {
    const { currentUser } = useAuth(); 
    const [studentData, setStudentData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [lcsCategories, setLcsCategories] = useState([]);
    const [swcsCategories, setSwcsCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authError, setAuthError] = useState('');
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchConditions = async () => {
            try {
                const response = await axios.get(`youcangraduate/api/conditions?studentId=${currentUser.id}`);
                setLcsCategories(response.data.lcsCategories || []);
                setSwcsCategories(response.data.swcsCategories || []);
            } catch (error) {
                console.error('Error fetching conditions:', error);
            }
        };

        fetchConditions();
    }, [currentUser.id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRef = ref(db, `users/${currentUser.id}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    setStudentData(snapshot.val());
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [currentUser]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        try {
            setIsAuthenticating(true);
            setAuthError('');
            const response = await sejong_authenticate(currentUser.id, event.target.password.value)
            console.log(response)
            if (response.is_auth) {
                formData.append('studentId', currentUser.id);
                formData.append('studentPW', event.target.password.value);

                const gradeResponse = await axios.post('youcangraduate/process', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('Response:', gradeResponse.data);
                const userRef = ref(db, `users/${currentUser.id}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    setStudentData(snapshot.val());
                    setShowForm(false);
                    setRefresh(prev=>!prev);
                }
            } else {
                setAuthError('인증에 실패하였습니다. 학사 비밀번호를 다시 확인해주세요.');
            }
        } catch (error) {
            console.error('Error processing form:', error);
            setAuthError('인증 실패하였습니다.');
        } finally {
            setIsAuthenticating(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {studentData && studentData.results ? (
                <div>
                    <ShowYouCanGraduate refresh={refresh} />
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? '성적 등록 양식 숨기기' : '성적 재등록 하기'}
                    </button>
                    {showForm && (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <h1>졸업 요건 검사</h1>
                            <div>
                                <label htmlFor="record_file">성적표 파일 업로드:</label>
                                <input type="file" id="record_file" name="record_file" required />
                            </div>
                            <div>
                                <label htmlFor="isDualMajor">복수 전공시 체크:</label>
                                <input type="checkbox" id="isDualMajor" name="isDualMajor" />
                            </div>
                            <div>
                                <h2>어학 인증</h2>
                                {lcsCategories.map((category, index) => (
                                    <div key={index}>
                                        <label htmlFor={`lcs_${index}`}>{category}</label>
                                        <input type="checkbox" id={`lcs_${index}`} name={category} />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h2>소프트웨어 인증</h2>
                                {swcsCategories.length > 0 ? 
                                    swcsCategories.map((category, index) => (
                                        <div key={index}>
                                            <label htmlFor={`swcs_${index}`}>{category}</label>
                                            <input type="checkbox" id={`swcs_${index}`} name={category} />
                                        </div>
                                    )) : 
                                    <p>이 부분은 해당 사항 있는 학번부터 적용됩니다.</p>}
                            </div>
                            <div>
                                <label htmlFor="password">학사 비밀번호:</label>
                                <input type="password" id="password" name="password" required />
                            </div>
                            {authError && <p className={styles.error}>{authError}</p>}
                            <button type="submit" disabled={isAuthenticating}>검사 시작</button>
                        </form>
                    )}
                </div>
            ) : (
                <div>
                    <h1>성적 등록하기</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div>
                        <label htmlFor="record_file">성적표 파일 업로드:</label>
                        <input type="file" id="record_file" name="record_file" required />
                    </div>
                    <div>
                        <label htmlFor="isDualMajor">복수 전공시 체크:</label>
                        <input type="checkbox" id="isDualMajor" name="isDualMajor" />
                    </div>
                    <div>
                        <h2>어학 인증</h2>
                        {lcsCategories.map((category, index) => (
                            <div key={index}>
                                <label htmlFor={`lcs_${index}`}>{category}</label>
                                <input type="checkbox" id={`lcs_${index}`} name={category} />
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2>소프트웨어 인증</h2>
                        {swcsCategories.length > 0 ? 
                            swcsCategories.map((category, index) => (
                                <div key={index}>
                                    <label htmlFor={`swcs_${index}`}>{category}</label>
                                    <input type="checkbox" id={`swcs_${index}`} name={category} />
                                </div>
                            )) : 
                            <p>이 부분은 해당 사항 있는 학번부터 적용됩니다.</p>}
                    </div>
                    <div>
                        <label htmlFor="password">학사 비밀번호:</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    {authError && <p className={styles.error}>{authError}</p>}
                    <button type="submit" disabled={isAuthenticating}>검사 시작</button>
                </form>
                </div>
            )}
        </div>
    );
};


export default GradeRegister;
