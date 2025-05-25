import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

const FileUpload = ({ onFileSelect, acceptedTypes = '.pdf,.jpg,.jpeg,.png' }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      console.log('Arquivos aceitos:', acceptedFiles);
      console.log('Arquivos rejeitados:', rejectedFiles);
      
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(file => {
          console.log('Arquivo rejeitado:', file.file.name, file.errors);
        });
      }
      
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles);
      }
    },
    onError: (error) => {
      console.error('Erro no upload:', error);
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed p-5 text-center rounded ${
        isDragActive ? 'border-danger bg-light' : 'border-secondary'
      }`}
      style={{ 
        cursor: 'pointer', 
        minHeight: '200px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}
    >
      <input {...getInputProps()} />
      <Upload size={48} className="mx-auto mb-3 text-danger" />
      <h5>{isDragActive ? 'Solte os arquivos aqui' : 'Selecionar arquivos'}</h5>
      <p className="text-muted mb-0">
        {isDragActive 
          ? 'Solte os arquivos para fazer upload' 
          : 'ou arraste e solte os arquivos aqui'
        }
      </p>
      <small className="text-muted mt-2">
        Tipos aceitos: PDF, JPG, PNG (máx. 10MB cada)
      </small>
    </div>
  );
};

export default FileUpload;
