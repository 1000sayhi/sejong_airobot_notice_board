import axios from 'axios';

export async function sejong_authenticate(id, password) {
  
    try {
        const response = await axios.post('sejongauth/auth?method=ClassicSession', {
            id: id,
            pw: password
        });

        if (response.data.result) {
            return response.data.result;
        } else {
            throw new Error('Authentication failed');
        }
    } catch (error) {
        console.error('Error authenticating:', error);
        throw error;
    }
}


// sejong_authenticate('20011837', '629623xc')
//     .then(result => {
//         console.log('Authentication result:', result);
//     })
//     .catch(error => {
//         console.error('Failed to authenticate:', error.message);
//     });
