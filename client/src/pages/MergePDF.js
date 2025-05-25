import React, { useState, useCallback } from 'react';
import { Container, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import FileUpload from '../components/upload/FileUpload';
import Loading from '../components/common/Loading';
import { GripVertical, X, FileText, ArrowUp, ArrowDown } from 'lucide-react';
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
      size: file.size
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
      files.forEach(fileItem => formData.append('pdfs', fileItem.file));
      
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

  // Mover arquivo para cima
  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setFiles(newFiles);
  };

  // Mover arquivo para baixo
  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  // Drag and Drop nativo HTML5
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
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
                  Use as setas ou arraste para reordenar
                </small>
              </div>
              
              <Row>
                {files.map((fileItem, index) => (
                  <Col md={6} lg={4} key={fileItem.id} className="mb-4">
                    <Card 
                      className={`h-100 shadow-sm ${draggedIndex === index ? 'border-primary' : ''}`}
                      style={{ 
                        cursor: 'move',
                        transition: 'all 0.2s ease',
                        opacity: draggedIndex === index ? 0.5 : 1
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <Card.Body className="text-center p-3">
                        {/* Número da ordem */}
                        <div className="position-relative mb-3">
                          <div 
                            className="badge bg-primary position-absolute"
                            style={{ top: '-10px', right: '-10px', fontSize: '0.8rem' }}
                          >
                            #{index + 1}
                          </div>
                          
                          {/* Miniatura PDF */}
                          <div 
                            className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                            style={{
                              width: '80px',
                              height: '100px',
                              backgroundColor: '#f8f9fa',
                              border: '2px solid #e9ecef',
                              borderRadius: '8px'
                            }}
                          >
                            <FileText size={40} color="#dc3545" />
                          </div>
                        </div>

                        {/* Nome do arquivo */}
                        <Card.Title 
                          className="h6 mb-2"
                          style={{ 
                            fontSize: '0.9rem',
                            lineHeight: '1.2',
                            height: '2.4rem',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                          title={fileItem.name}
                        >
                          {fileItem.name}
                        </Card.Title>

                        {/* Tamanho */}
                        <Card.Text className="text-muted small mb-3">
                          {(fileItem.size / 1024 / 1024).toFixed(2)} MB
                        </Card.Text>

                        {/* Controles */}
                        <div className="d-flex justify-content-center gap-1">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            title="Mover para cima"
                          >
                            <ArrowUp size={14} />
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => moveDown(index)}
                            disabled={index === files.length - 1}
                            title="Mover para baixo"
                          >
                            <ArrowDown size={14} />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeFile(fileItem.id)}
                            title="Remover arquivo"
                          >
                            <X size={14} />
                          </Button>
                        </div>

                        {/* Indicador de drag */}
                        <div className="mt-2">
                          <small className="text-muted">
                            <GripVertical size={12} className="me-1" />
                            Arraste para reordenar
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
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
