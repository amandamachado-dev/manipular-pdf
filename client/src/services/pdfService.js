import api from './api';

export const mergePDFs = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('pdfs', file));
  
  const response = await api.post('/pdf/merge', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const splitPDF = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  
  const response = await api.post('/pdf/split', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const rotatePDF = async (file, rotation = 90) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('rotation', rotation);
  
  const response = await api.post('/pdf/rotate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const imagesToPDF = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  
  const response = await api.post('/pdf/images-to-pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
