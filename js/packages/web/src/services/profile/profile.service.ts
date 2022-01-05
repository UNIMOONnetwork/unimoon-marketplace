import {
    ProfileOwnerRequest,
    ProfileByIDRequest,
    Profile
} from './profile.types';
import axios from '../base';

export class ProfileService {
    createProfile = async(id: ProfileOwnerRequest | String, profile: any) => {
        const owner = typeof id === 'string' ? id : id?.toString() || '';
        if (owner) {
            return new Promise((resolve, reject) => 
                axios.post('/createprofile', profile)
                    .then(({data}) => {
                        resolve(data);
                    })
                    .catch(({ response: {data: err}}) => {
                        console.log(err);
                        reject(err);
                    })
            );
        }
    }
}

export default new ProfileService();