import axios from '../../utils/axios';

export class UploadService {
  uploadImage = async (image: any) => {
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

export default new UploadService();
