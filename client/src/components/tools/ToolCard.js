import React from 'react';
import { Card } from 'react-bootstrap';

const ToolCard = ({ icon: Icon, title, description, href, iconColor = "#e74c3c" }) => {
  return (
    <Card className="h-100 shadow-sm" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
      <Card.Body className="text-center d-flex flex-column">
        <div className="mb-3">
          <Icon size={48} style={{ color: iconColor }} />
        </div>
        <Card.Title className="h5">{title}</Card.Title>
        <Card.Text className="text-muted flex-grow-1">{description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ToolCard;
