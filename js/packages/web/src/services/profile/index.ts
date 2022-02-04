import axios from '../../utils/axios';

export type Profile = {
  id: string;
  wallet: string;
  username: string;
  gender: string;
  email: string;
  mobile: string;
  country_code: string;
  profile_image: string;
  bio: string;
  birthdate: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ProfileService {
  getAllProfiles = async () => {
    const { data } = await axios.get('/profiles');

    return data;
  };

  getProfileOwner = async (ownerId): Promise<Profile[]> => {
    const { data } = await axios.get(`/profiles/owner/${ownerId}`);

    return data;
  };

  getProfileByID = async (profileId): Promise<Profile[]> => {
    const { data } = await axios.get(`/profiles/${profileId}`);

    return data;
  };

  createProfile = async (id: string, profile: any) => {
    if (id) {
      return new Promise((resolve, reject) =>
        axios
          .post(`/createprofile`, profile)
          .then(({ data }) => {
            resolve(data);
          })
          .catch(({ response: { data: err } }) => {
            console.log(err);
            reject(err);
          }),
      );
    }
  };

  updateProfile = async (id: string, profile: any) => {
    if (id) {
      return new Promise((resolve, reject) =>
        axios
          .put(`/updateprofile/${profile.profileId}`, profile)
          .then(({ data }) => {
            resolve(data);
          })
          .catch(({ response: { data: err } }) => {
            console.log(err);
            reject(err);
          }),
      );
    }
  };

  uploadImageToS3 = async (image: any) => {
    const formData = new FormData();
    formData.append('image', image);

    const res = await axios.post(
      `${process.env.NEXT_APP_BASE_URL}/images`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    if (res.data) return `${process.env.NEXT_APP_BASE_URL}/images/${res.data}`;
    return '';
  };
}

export default new ProfileService();
