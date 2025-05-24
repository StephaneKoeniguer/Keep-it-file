/* eslint-disable */
import axios from 'axios';

const API_URL_DOCUMENT = 'https://127.0.0.1:8000/api/pictures';

export default class PictureAPI {

  /**
   * Create a new picture
   * @param picture
   * @returns {Promise<any>}
   * @constructor
   */
  static async RegisterPicture(picture) {
    try {
      const response = await axios.post(API_URL_DOCUMENT, picture, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  }

  /**
   * Recover all pictures
   * @returns {Promise<any>}
   * @constructor
   */
  static async GetPictures() {
    try {
      const response = await axios.get(API_URL_DOCUMENT, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  }

  /**
   * Delete o spécific picture
   * @param id
   * @returns {Promise<any>}
   * @constructor
   */
  static async DeletePicture(id) {
    try {
      const response = await axios.delete(`${API_URL_DOCUMENT}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  }

}