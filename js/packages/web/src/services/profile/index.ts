import axios, { decryptResponse } from '../../utils/axios';

export type Profile = {
  id: string;
  wallet: string;
  username: string;
  gender: string;
  email: string;
  password?: string;
  mobile: string;
  country_code: string;
  profile_image: string;
  bio: string;
  birthdate: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ProfileService {
  getProfileByID = async (wallet): Promise<string> => {
    const response =
      'I09v1m9AniGRWnzi68U//VZXY5UvF7KW2sW1CFbUyy+NFR3PWHJT2aGCRjFZhwQU'; //await axios.get(`/get_userby_wallet?wallet=${wallet}`);

    return decryptResponse(response);
  };
}

export default new ProfileService();
