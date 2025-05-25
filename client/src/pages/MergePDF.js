import React, { useState, useCallback } from 'react';
import { Container, Button, Alert, Row, Col } from 'react-bootstrap';
import FileUpload from '../components/upload/FileUpload';
import Loading from '../components/common/Loading';
import PDFCard from '../components/upload/PDFCard';
import api from '../services/api';

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const generateUniqueId = () => {
    return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleFileSelect = useCallback((selectedFiles) => {
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      setError('Apenas arquivos PDF são aceitos');
      return;
    }
    
    const filesWithId = pdfFiles.map((file) => ({
      id: generateUniqueId(),
      file: file,
      name: file.name,
      size: file.size,
      rotation: 0 // Rotação inicial
    }));
    
    setFiles(prevFiles => [...prevFiles, ...filesWithId]);
    setError('');
    setSuccess('');
  }, []);

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Selecione pelo menos 2 arquivos PDF');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      
      // Enviar arquivos com informações de rotação
      files.forEach((fileItem, index) => {
        formData.append('pdfs', fileItem.file);
        formData.append(`rotation-${index}`, fileItem.rotation.toString());
      });
      
      const response = await api.post('/pdf/merge', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess('PDF criado e baixado com sucesso!');
      
    } catch (error) {
      console.error('Erro:', error);
      setError(error.response?.data?.error || 'Erro ao juntar PDFs');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = useCallback((id) => {
    setFiles(prevFiles => prevFiles.filter(fileItem => fileItem.id !== id));
  }, []);

  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setFiles(newFiles);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  // Rotacionar PDF individual
  const rotatePDF = useCallback((id) => {
    setFiles(prevFiles => 
      prevFiles.map(fileItem => 
        fileItem.id === id 
          ? { ...fileItem, rotation: (fileItem.rotation + 90) % 360 }
          : fileItem
      )
    );
  }, []);

  // Drag and Drop
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);
    
    setFiles(newFiles);
    setDraggedIndex(null);
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1>Juntar arquivos PDF</h1>
        <p className="text-muted">Mesclar e juntar PDFs e colocá-los em qualquer ordem que desejar. É tudo muito fácil e rápido!</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading ? (
        <Loading message="Juntando arquivos PDF..." />
      ) : (
        <>
          <FileUpload onFileSelect={handleFileSelect} acceptedTypes=".pdf" />
          
          {files.length > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Arquivos selecionados ({files.length}):</h5>
                <small className="text-muted">
                  🔄 Clique no ícone de rotação para girar • ↕️ Use setas para reordenar
                </small>
              </div>
              
              <Row>
                {files.map((fileItem, index) => (
                  <Col md={6} lg={4} xl={3} key={fileItem.id} className="mb-4">
                    <PDFCard
                      fileItem={fileItem}
                      index={index}
                      totalFiles={files.length}
                      onMoveUp={moveUp}
                      onMoveDown={moveDown}
                      onRemove={removeFile}
                      onRotate={rotatePDF}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      isDragging={draggedIndex === index}
                    />
                  </Col>
                ))}
              </Row>
              
              <div className="text-center mt-4">
                <Button 
                  variant="danger" 
                  size="lg" 
                  onClick={handleMerge}
                  disabled={files.length < 2}
                >
                  Juntar {files.length} PDFs na ordem exibida
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default MergePDF;
