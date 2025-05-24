/* eslint-disable */
import axios from 'axios';

const API_URL_DOCUMENT = 'https://127.0.0.1:8000/api/documents';
const API_URL_DOCUMENT_DOWNLOAD = 'https://127.0.0.1:8000/api/documents/download';
const API_URL_DOCUMENT_SHARE = 'https://127.0.0.1:8000/api/documents/share';

export default class DocumentAPI {

  /**
   * Create a new document
   * @param document
   * @returns {Promise<any>}
   * @constructor
   */
  static async RegisterDocument(document) {
    try {
      const response = await axios.post(API_URL_DOCUMENT, document, {
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
   * Recover all documents
   * @returns {Promise<any>}
   * @constructor
   */
  static async GetDocuments() {
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
   * Delete a specific document
   * @param id
   * @returns {Promise<any>}
   * @constructor
   */
  static async DeleteDocuments(id) {
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

  /**
   * Download a specific document
   * @param id
   * @returns {Promise<any>}
   * @constructor
   */
  static async downloadDocuments(id) {
    try {
      const response = await axios.get(`${API_URL_DOCUMENT_DOWNLOAD}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        responseType: 'blob',
      });
      DocumentAPI.handleType(response, id);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  }

  /**
   * Manage link download and extension file
   * @param response
   * @param id
   */
  static handleType(response, id) {
    const blob = response.data;
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;

    switch(response.data.type) {
      case 'application/pdf':
        link.download = `document_${id}.pdf`;
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        link.download = `document_${id}.docx`;
        break;
      case 'application/msword':
        link.download = `document_${id}.doc`;
        break;
      case 'application/vnd.ms-excel':
        link.download = `document_${id}.xls`;
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        link.download = `document_${id}.xlsx`;
        break;
      default:
        link.download = `document_${id}.pdf`;
        break;
    }

    link.click();

    // Libération de l'URL après le téléchargement
    window.URL.revokeObjectURL(url);
  }

  /**
   * Create public link to share document
   * @param id
   * @returns {Promise<any>}
   */
  static async shareDocuments(id) {
    try {
      const response = await axios.get(`${API_URL_DOCUMENT_SHARE}/${id}`, {
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