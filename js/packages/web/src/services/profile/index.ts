import axios from '../../utils/axios';

export type Profile = {
  id: string;
  wallet: string;
  username: string;
  gender: string;
  email: string;
  password: string;
  mobile: string;
  country_code: string;
  profile_image: string;
  bio: string;
  birthdate: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ProfileService {
  getProfileByID = async (wallet): Promise<Profile> => {
    const { data } = await axios.get(`/user/${wallet}`);

    return data;
  };

  updateProfile = async (id: string, profile: any) => {
    if (id) {
      return new Promise((resolve, reject) =>
        axios
          .put(`/user/edit_profile`, profile)
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
