/* eslint-disable */
import axios from 'axios';

const API_URL_REGISTER = 'https://127.0.0.1:8000/api/register';
const API_URL_CONNECT = 'https://127.0.0.1:8000/api/login_check';
const API_URL_GETUSER = 'https://127.0.0.1:8000/api/users';
const API_URL_GETUSER_INFOS = 'https://127.0.0.1:8000/api/users/infos';

export default class UserAPI {

  /**
   * Connect to the server
   * @param user
   * @returns {Promise<any>}
   * @constructor
   */
  static async ConnectUser(user) {
    try {
      const response = await axios.post(API_URL_CONNECT, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  }

  /**
   * Create a new
   * @param user
   * @returns {Promise<any>}
   * @constructor
   */
  static async RegisterUser(user) {
    try {
      const response = await axios.post(API_URL_REGISTER, user, {
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

  /**
   * Recover all users
   * @returns {Promise<any>}
   * @constructor
   */
  static async GetUsers() {
    try {
      const response = await axios.get(API_URL_GETUSER, {
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
   * Recover informations about one spécific user
   * @param user
   * @returns {Promise<any>}
   * @constructor
   */
  static async GetUserInfo(user) {
    try {
      const response = await axios.post(API_URL_GETUSER_INFOS, user, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  }


}