import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData()

  //Append image file to formdata
  formData.append('image', imageFile)

  try {
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': "multiport/form-data", //setting header for file upload
      },
    })
    return response.data
  } catch (error) {
    console.log("Error uploading the image", error);
    throw error
  }
}

export default uploadImage