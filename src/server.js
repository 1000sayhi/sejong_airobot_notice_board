const express = require('express');
const path = require('path');
const multer = require('multer');
const ExcelJS = require('exceljs');
const { ref, update, get, child } = require('firebase/database');
const { db } = require('./firebase');
const axios = require('axios');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const conditionFile = path.resolve(__dirname, 'condition.xlsx');
console.log(`Reading condition file from: ${conditionFile}`);

app.get('/api/conditions', async (req, res) => {
    try {
        console.log('Request received at /api/conditions');
        
        const studentId = req.query.studentId;
        console.log('studentId:', studentId);

        

        const admissionYear = parseInt(studentId.slice(0, 2)) + 2000;
        const worksheetName = admissionYear.toString();
        console.log('admissionYear:', admissionYear);
        console.log('worksheetName:', worksheetName);

        const workbook = new ExcelJS.Workbook();
        console.log('Reading condition file:', conditionFile);

        await workbook.xlsx.readFile(conditionFile);
        console.log('Condition file read successfully');

        const sheet = workbook.getWorksheet(worksheetName);
        if (!sheet) {
            throw new Error(`Worksheet "${worksheetName}" not found`);
        }
        console.log(`Worksheet "${worksheetName}" found`);

        const lcsCategories = sheet.getColumn('I').values.slice(2).filter(Boolean);
        const swcsCategories = sheet.getColumn('K').values.slice(2).filter(Boolean);
        console.log('lcsCategories:', lcsCategories);
        console.log('swcsCategories:', swcsCategories);
        
        res.json({
            lcsCategories,
            swcsCategories
        });
    } catch (err) {
        console.error('Error reading condition.xlsx:', err.message);
        res.status(500).send('Error reading condition file');
    }
});



app.post('/process', upload.single('record_file'), async (req, res) => {
    try {
        const { studentId, studentPW } = req.body;
        const isDualMajor = req.body.isDualMajor === 'on' ? true : false; // 복수 전공 여부
        console.log('복수 전공 여부:', isDualMajor); // 디버깅을 위해 추가

        const admissionYear = parseInt(studentId.slice(0, 2)) + 2000;
        const worksheetName = admissionYear.toString();

        const recordFilePath = req.file.path;
        console.log('Record file path:', recordFilePath);

        // 고전독서 인증 정보 가져오기
        const authResponse = await axios.post('https://auth.imsejong.com/auth?method=ClassicSession', {
            id: studentId,
            pw: studentPW
        });

        console.log('Auth response:', authResponse.data);

        const readCertification = authResponse.data.result.body.read_certification || {};
        console.log('고전 독서 인증 정보:', readCertification);

        // 고전독서 인증 카테고리와 필수 이수 권수, 현재 이수 권수 추출
        const rcsCategories = Object.keys(readCertification).map(key => key.split('(')[0]);
        const rcsRequired = Object.keys(readCertification).map(key => parseInt(key.match(/\((\d+)권\)/)[1]));
        const rcsCompleted = Object.values(readCertification).map(value => parseInt(value));
        // 고전독서 인증 결과를 각 카테고리별로 저장
        const rcsResults = {};
        rcsCategories.forEach((category, index) => {
            const required = rcsRequired[index];
            const completed = rcsCompleted[index];
            rcsResults[category] = completed >= required;
        });

        // 졸업 요건 파일 읽기
        const conditionWorkbook = new ExcelJS.Workbook();
        await conditionWorkbook.xlsx.readFile(conditionFile);
        const conditionSheet = conditionWorkbook.getWorksheet(worksheetName);

        // 성적 파일 읽기
        const recordWorkbook = new ExcelJS.Workbook();
        await recordWorkbook.xlsx.readFile(recordFilePath);
        const recordSheet = recordWorkbook.worksheets[0];

        const lcsCategories = conditionSheet.getColumn('I').values.slice(2).filter(Boolean);
        const lcsCompleted = {};
        lcsCategories.forEach(category => {
            lcsCompleted[category] = req.body[category] === 'on';
        });

        let swcsCategories = [];
        let swcsCompleted = {};
        if (parseInt(studentId.slice(0, 2)) >= 23) {
            swcsCategories = conditionSheet.getColumn('K').values.slice(2).filter(Boolean);
            swcsCategories.forEach(category => {
                swcsCompleted[category] = req.body[category] === 'on';
            });
        }

        // 전공과 관련된 기초 교양(필수로 이수해야 하는)
        const requiredSubjectsMajor = conditionSheet.getColumn('A').values.slice(2).filter(Boolean);
        // 전공과 관련 없는 기초 교양(필수로 이수해야 하는)
        const requiredSubjectsLiberalArts = conditionSheet.getColumn('B').values.slice(2).filter(Boolean);

        let completedSubjectsMajor = recordSheet.getColumn('E').values.slice(5).filter(subject => requiredSubjectsMajor.includes(subject));
        let completedSubjectsLiberalArts = recordSheet.getColumn('E').values.slice(5).filter(subject => requiredSubjectsLiberalArts.includes(subject));

        // 총 이수 학점 계산
        const completedCredits = recordSheet.getColumn('I').values.slice(5).reduce((sum, credit, index) => {
            const grade = recordSheet.getColumn('K').values[index + 5];
            if (grade !== 'NP') {
                return sum + (parseInt(credit) || 0);
            }
            return sum;
        }, 0);
        const totalRequiredCredits = conditionSheet.getCell('C2').value;

        const categories = conditionSheet.getColumn('D').values.slice(2).filter(Boolean);
        const categoryRequirements = {};

        const excludedCategories = isDualMajor ? [] : ['복선', '복필']; // 복수 전공 아닐 때는 복선 복필은 배제하기
        if (isDualMajor === false) {
            excludedCategories.forEach(excludedCategory => {
                const index = categories.indexOf(excludedCategory);
                if (index > -1) {
                    categories.splice(index, 1);
                }
            });
        }

        categories.forEach((category, index) => {
            if (!excludedCategories.includes(category)) {
                const requirement = isDualMajor ? conditionSheet.getCell(`F${index + 2}`).value : conditionSheet.getCell(`E${index + 2}`).value;
                categoryRequirements[category] = requirement;
            }
        });

        // 교선1과 교선2의 조건 통합
        if (categories.includes('교선1') && categories.includes('교선2')) {
            const ARequirement = categoryRequirements['교선1'];
            const BRequirement = categoryRequirements['교선2'];
            categoryRequirements['교선'] = (ARequirement + BRequirement) / 2;
        }

        const completedCategoryCredits = {};
        categories.forEach((category, index) => {
            const requirement = isDualMajor ? conditionSheet.getCell(`F${index + 2}`).value : conditionSheet.getCell(`E${index + 2}`).value;
            const completedCredits = recordSheet.getColumn('F').values.slice(5).reduce((sum, value, idx) => {
                const credits = recordSheet.getColumn('I').values[idx + 5];
                const grade = recordSheet.getColumn('K').values[idx + 5];
                if (value.includes(category) && grade !== 'NP') {
                    return sum + (parseInt(credits) || 0);
                }
                return sum;
            }, 0);
            categoryRequirements[category] = requirement;
            completedCategoryCredits[category] = completedCredits;
        });
        if (categories.includes('교선1') && categories.includes('교선2')) {
            completedCategoryCredits['교선'] = completedCategoryCredits['교선1'] + completedCategoryCredits['교선2'];
        }

        // 인증 결과 계산
        const certificationResults = [];
        certificationResults.push(['고전 독서 인증', rcsCategories.every(category => rcsResults[category]) ? 'P' : 'F']);
        certificationResults.push(['어학 인증', lcsCategories.some(category => lcsCompleted[category]) ? 'P' : 'F']);

        if (parseInt(studentId.slice(0, 2)) >= 23) {
            certificationResults.push(['소프트웨어 코딩 인증', swcsCategories.some(category => swcsCompleted[category]) ? 'P' : 'F']);
            const certifications = [
                rcsCategories.every(category => rcsResults[category]),
                lcsCategories.some(category => lcsCompleted[category]),
                swcsCategories.some(category => swcsCompleted[category])
            ];
            certificationResults.push(['최종 졸업 인증', certifications.filter(Boolean).length >= 2 ? 'P' : 'F']);
        } else {
            certificationResults.push(['최종 졸업 인증', rcsCategories.every(category => rcsResults[category]) && lcsCategories.some(category => lcsCompleted[category]) ? 'P' : 'F']);
        }

        console.log('categoryRequirements:', categoryRequirements);
        console.log('completedCategoryCredits:', completedCategoryCredits);

        // 결과 배열 생성
        const results = [];
        results.push(['학문기초교양필수 이수 과목', `${completedSubjectsMajor.length} / ${requiredSubjectsMajor.length}`]);
        results.push(['균형교양(교양선택) 이수 과목', `${completedSubjectsLiberalArts.length} / ${requiredSubjectsLiberalArts.length}`]);
        results.push(['총 학점', `${completedCredits} / ${totalRequiredCredits}`]);
        for (const category in categoryRequirements) {
            if (categoryRequirements.hasOwnProperty(category)) {
                //수정 : 필수 이수 학점이 object로 나오면 그 안에 있는 값 사용, 아니면 그대로
                const requirement = categoryRequirements[category];
                const requirementValue = typeof requirement === 'object' ? requirement.result : requirement;
                results.push([category, `${completedCategoryCredits[category]} / ${requirementValue}`]);
            }
        }

        const isGraduated = results.every(([_, value]) => {
            const [completed, required] = value.split(' / ').map(Number);
            return completed >= required;
        });

        
        const userRef = ref(db, `users/${studentId}`);

        const snapshot = await get(child(ref(db), `users/${studentId}`));
        const existingData = snapshot.val() || {};
        await update(userRef, {
            ...existingData,
            isGraduated,
            results,
            certifications: certificationResults
        });

        
        res.json({ 
            results,
            certifications: certificationResults,
            isGraduated
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred during processing.' });
    }
});


const PORT = 5001;
app.listen(PORT, () => {
    console.log(`서버가 http://127.0.0.1:${PORT} 에서 실행 중입니다.`);
});
