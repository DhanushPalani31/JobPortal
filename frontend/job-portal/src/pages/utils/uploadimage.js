import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosinstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout for uploads
      }
    );

    // Check response structure
    if (response.data && response.data.success) {
      return {
        imageUrl: response.data.imageUrl || response.data.url,
        publicId: response.data.public_id
      };
    } else {
      throw new Error('Upload response invalid');
    }
  } catch (error) {
    console.error('Error uploading the image:', error);
    throw error;
  }
};

export default uploadImage;