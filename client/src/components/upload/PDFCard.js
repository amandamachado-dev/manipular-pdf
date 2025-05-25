import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { ArrowUp, ArrowDown, X, RotateCw, FileText } from 'lucide-react';

const PDFCard = ({ 
  fileItem, 
  index, 
  onMoveUp, 
  onMoveDown, 
  onRemove, 
  onRotate,
  totalFiles,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging 
}) => {

  const handleRotate = () => {
    onRotate(fileItem.id);
  };

  return (
    <Card 
      className={`h-100 shadow-sm ${isDragging ? 'border-primary' : ''}`}
      style={{ 
        cursor: 'move',
        transition: 'all 0.2s ease',
        opacity: isDragging ? 0.5 : 1
      }}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
    >
      <Card.Body className="text-center p-3">
        {/* Número da ordem */}
        <div className="position-relative mb-3">
          <div 
            className="badge bg-primary position-absolute"
            style={{ top: '-10px', right: '-10px', fontSize: '0.8rem', zIndex: 10 }}
          >
            #{index + 1}
          </div>
          
          {/* Miniatura do PDF com rotação visual */}
          <div 
            className="mx-auto mb-2 d-flex align-items-center justify-content-center position-relative"
            style={{
              width: '100px',
              height: '120px',
              backgroundColor: '#ffffff',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {/* PDF Icon com rotação aplicada */}
            <div 
              style={{
                transform: `rotate(${fileItem.rotation || 0}deg)`,
                transition: 'transform 0.3s ease'
              }}
            >
              <FileText 
                size={50} 
                color="#dc3545" 
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </div>
            
            {/* Botão de rotação sobreposto */}
            <Button
              variant="light"
              size="sm"
              className="position-absolute"
              style={{ 
                top: '5px', 
                left: '5px',
                padding: '4px 8px',
                fontSize: '0.7rem',
                opacity: 0.9,
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}
              onClick={handleRotate}
              title={`Rotacionar 90° (atual: ${fileItem.rotation || 0}°)`}
            >
              <RotateCw size={12} />
            </Button>

            {/* Indicador de rotação */}
            {fileItem.rotation && fileItem.rotation !== 0 && (
              <div
                className="position-absolute badge bg-warning"
                style={{ 
                  bottom: '5px', 
                  right: '5px',
                  fontSize: '0.6rem'
                }}
              >
                {fileItem.rotation}°
              </div>
            )}
          </div>
        </div>

        {/* Nome do arquivo */}
        <Card.Title 
          className="h6 mb-2"
          style={{ 
            fontSize: '0.85rem',
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

        {/* Info do arquivo */}
        <Card.Text className="text-muted small mb-3">
          {(fileItem.size / 1024 / 1024).toFixed(2)} MB
          {fileItem.rotation && fileItem.rotation !== 0 && (
            <><br/>Rotação: {fileItem.rotation}°</>
          )}
        </Card.Text>

        {/* Controles */}
        <div className="d-flex justify-content-center gap-1 mb-2">
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            title="Mover para cima"
          >
            <ArrowUp size={14} />
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => onMoveDown(index)}
            disabled={index === totalFiles - 1}
            title="Mover para baixo"
          >
            <ArrowDown size={14} />
          </Button>
          <Button 
            variant="outline-warning" 
            size="sm"
            onClick={handleRotate}
            title="Rotacionar 90°"
          >
            <RotateCw size={14} />
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => onRemove(fileItem.id)}
            title="Remover arquivo"
          >
            <X size={14} />
          </Button>
        </div>

        {/* Indicador de drag */}
        <div className="mt-1">
          <small className="text-muted">
            Arraste para reordenar
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PDFCard;
