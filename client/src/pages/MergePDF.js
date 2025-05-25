import React, { useState } from 'react';
import { Container, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import FileUpload from '../components/upload/FileUpload';
import Loading from '../components/common/Loading';
import api from '../services/api';

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileSelect = (selectedFiles) => {
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      setError('Apenas arquivos PDF são aceitos');
      return;
    }
    
    setFiles(pdfFiles);
    setError('');
    setSuccess('');
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Selecione pelo menos 2 arquivos PDF');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('pdfs', file));
      
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

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
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
              <h5>Arquivos selecionados ({files.length}):</h5>
              <Row>
                {files.map((file, index) => (
                  <Col md={6} lg={4} key={index} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title className="h6">{file.name}</Card.Title>
                        <Card.Text className="text-muted small">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Card.Text>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          Remover
                        </Button>
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
                  Juntar {files.length} PDFs
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
