import { useState } from 'react';
import axios from 'axios';

const useOCRHook = () => {
  const OCR_SPACE_API_KEY = 'K85789478188957'; // Replace this with your actual API key
  const MAX_RETRIES = 3;

  const processImage = async (imageBase64, retries = 0) => {
    try {
      const formData = new FormData();
      formData.append('apikey', OCR_SPACE_API_KEY);
      formData.append('base64Image', imageBase64);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('OCREngine', '2');

      const response = await axios.post('https://api.ocr.space/parse/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const result = response.data;
      console.log('OCR processing result:', result);

      if (result.IsErroredOnProcessing) {
        throw new Error('OCR processing failed: ' + result.ErrorMessage.join(' '));
      }

      return result;
    } catch (error) {
      console.error('OCR processing failed: ', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        if (error.response.status === 403) {
          console.error('Authentication or authorization error occurred. Check API key and permissions.');
        }
      }
      if (retries < MAX_RETRIES) {
        console.log('Retrying...');
        return processImage(imageBase64, retries + 1);
      } else {
        throw error;
      }
    }
  };

  return { processImage };
};

export default useOCRHook;
